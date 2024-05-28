import * as TYPES from './_types';
import { getUnseenNotifications } from './_selectors';
import { apiService } from 'utils/api';
import { errorHandler } from 'utils/alerts';
import firebase from 'utils/firebase';

let authUnsubscribe;

export function initFirebaseAuth() {
  return function(dispatch) {
    dispatch({ type: TYPES.INIT_FIREBASE_AUTH });

    authUnsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        dispatch(getCustomToken()).then(token => {
          if (token) {
            // User signing in firebase
            dispatch(signInWithCustomToken({ token }));
          } else {
            dispatch({ type: TYPES.INIT_FIREBASE_AUTH_ERROR });
          }
        });
      } else {
        /* User is signed in Firebase 
          Sets state.notifications.init as TRUE.
          Every other firebase request must be done AFTER this step */
        dispatch({ type: TYPES.INIT_FIREBASE_AUTH_SUCCESS });
      }
    });
  };
}

export function getCustomToken() {
  return function(dispatch) {
    dispatch({ type: TYPES.GET_CUSTOM_TOKEN });

    return apiService
      .get(`auth/firebase`)
      .then(response => {
        dispatch({ type: TYPES.GET_CUSTOM_TOKEN_SUCCESS, payload: response.data });

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.GET_CUSTOM_TOKEN_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function signInWithCustomToken(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.SIGN_IN_WITH_CUSTOM_TOKEN });

    return (
      firebase
        .auth()
        // Indicates that the state will only be stored in memory and will be cleared when the window or activity is refreshed. (Fixes subdomains domains issues)
        .setPersistence(firebase.auth.Auth.Persistence.NONE)
        .then(function() {
          return firebase
            .auth()
            .signInWithCustomToken(params.token)
            .catch(error => {
              dispatch({ type: TYPES.SIGN_IN_WITH_CUSTOM_TOKEN_ERROR });
              errorHandler(dispatch, { data: { message: error.message, code: error.code } });
            });
        })
        .catch(error => {
          errorHandler(dispatch, { data: { message: error.message, code: error.code } });
        })
    );
  };
}

export function firebaseSignOut(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.SIGN_OUT });

    // Detach onAuthStateChanged event listener
    if (authUnsubscribe) authUnsubscribe();

    return firebase
      .auth()
      .signOut()
      .then(() => dispatch({ type: TYPES.SIGN_OUT_SUCCESS }))
      .catch(error => {
        dispatch({ type: TYPES.SIGN_OUT_ERROR });
        errorHandler(dispatch, { data: { message: error.message, code: error.code } });
      });
  };
}

// Get all unread team Notifications
function getUserTeamUnreadNotifications(query, last_seen) {
  return dispatch => {
    let unreadQuery = query;

    if (last_seen)
      unreadQuery = unreadQuery
        .where('timestamp', '>', last_seen)
        .where('marked_as_seen', '==', false);

    unreadQuery
      .get()
      .then(querySnapshot => {
        let notifications = [];
        querySnapshot.forEach(doc => {
          if (doc.data().type !== 'welcome') {
            notifications.push({
              category: doc.data().category,
              id: doc.id,
              subcategory: doc.data().subcategory,
              timestamp: doc.data().timestamp
            });
          }
        });

        dispatch({
          type: TYPES.GET_USER_TEAM_UNREAD_NOTIFICATIONS,
          payload: notifications
        });
      })
      .catch(error => {
        errorHandler(dispatch, { data: { message: error.message, code: error.code } });
      });
  };
}

// Get any new notification - real time
function watchUserTeamNotifications(query, per_page) {
  return dispatch => {
    query.limit(per_page).onSnapshot(snapshot => {
      let notifications = [];

      snapshot.docChanges().forEach(change => {
        if (change.doc.data().type !== 'welcome') {
          notifications.push({ ...change.doc.data(), id: change.doc.id });
        }
      });

      dispatch({
        type: TYPES.GET_USER_TEAM_NEW_NOTIFICATIONS,
        payload: notifications
      });
    });
  };
}

export function getUserTeamNotifications(params) {
  const { user_id, team_id, last_notification, per_page, init, last_seen } = params;
  const db = firebase.firestore();
  db.settings({
    timestampsInSnapshots: true
  });

  return function(dispatch) {
    dispatch({ type: TYPES.GET_USER_TEAM_NOTIFICATIONS });

    let query = db
      .collection(`users/${user_id}/teams/${team_id}/notifications`)
      .orderBy('timestamp', 'desc');

    if (last_notification) query = query.startAfter(last_notification);

    const snapshot = query
      .limit(per_page)
      .get()
      .then(querySnapshot => {
        let notifications = [];

        querySnapshot.forEach(doc => {
          if (doc.data().type !== 'welcome') {
            notifications.push({ ...doc.data(), id: doc.id });
          }
        });

        if (!init) {
          /* Only on initial request, set event Listener (wather), and
              get all unread messages after the last_seen timestamp
          */
          dispatch(watchUserTeamNotifications(query, per_page));
          dispatch(getUserTeamUnreadNotifications(query, last_seen));
        }

        dispatch({
          type: TYPES.GET_USER_TEAM_NOTIFICATIONS_SUCCESS,
          payload: notifications
        });
      })
      .catch(error => {
        dispatch({ type: TYPES.GET_USER_TEAM_NOTIFICATIONS_ERROR });
        errorHandler(dispatch, { data: { message: error.message, code: error.code } });
      });

    return snapshot;
  };
}

export function getUserTeamLastSeenTimestamp(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.GET_USER_TEAM_LAST_SEEN_TIMESTAMP });

    const { user_id, team_id } = params;
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });

    const docRef = db.doc(`users/${user_id}/teams/${team_id}`);
    return docRef
      .get()
      .then(doc => {
        if (doc.exists) {
          dispatch({ type: TYPES.GET_USER_TEAM_LAST_SEEN_TIMESTAMP_SUCCESS, payload: doc.data() });
          return Promise.resolve();
        } else {
          dispatch({ type: TYPES.GET_USER_TEAM_LAST_SEEN_TIMESTAMP_SUCCESS, payload: {} });
          return Promise.resolve();
        }
      })
      .catch(error => {
        dispatch({ type: TYPES.GET_USER_TEAM_LAST_SEEN_TIMESTAMP_ERROR });
        errorHandler(dispatch, { data: { message: error.message, code: error.code } });

        return Promise.reject();
      });
  };
}

// Set new last_seen UTC timestamp on dropdown bell toggle
export function setUserTeamLastSeenTimestamp(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.SET_USER_TEAM_LAST_SEEN_TIMESTAMP });

    const { user_id, team_id, last_seen } = params;
    const db = firebase.firestore();
    db.settings({
      timestampsInSnapshots: true
    });

    const docRef = db.doc(`users/${user_id}/teams/${team_id}`);
    docRef
      .set({
        last_seen
      })
      .then(function() {
        dispatch({
          type: TYPES.SET_USER_TEAM_LAST_SEEN_TIMESTAMP_SUCCESS,
          payload: { last_seen, unread_notifications: 0 }
        });
      })
      .catch(function(error) {
        dispatch({ type: TYPES.SET_USER_TEAM_LAST_SEEN_TIMESTAMP_ERROR });
        errorHandler(dispatch, { data: { message: error.message, code: error.code } });
      });
  };
}

export const markAsSeen = (id, type) => (dispatch, getState) => {
  const state = getState();
  const user_id = state.user.id;
  const team_id = state.teams.active.id;
  const notifications = getUnseenNotifications(state, id, type).map(
    notification => notification.id
  );

  dispatch({ type: TYPES.MARK_TEAM_NOTIFICATION_AS_SEEN });
  return updateNotificationsDoc({
    user_id,
    team_id,
    notifications
  })
    .then(() =>
      dispatch({ type: TYPES.MARK_TEAM_NOTIFICATION_AS_SEEN_SUCCESS, payload: notifications })
    )
    .catch(error => dispatch({ type: TYPES.MARK_TEAM_NOTIFICATION_AS_SEEN_ERROR, payload: error }));
};

// Marks an array of notifications as SEEN - will be excluded of unread_notications
const updateNotificationsDoc = params => {
  const { user_id, team_id, notifications } = params;
  const db = firebase.firestore();
  db.settings({
    timestampsInSnapshots: true
  });

  const promises = notifications.map(not => {
    const docRef = db
      .collection(`users/${user_id}/teams/${team_id}/notifications`)
      .doc(not)
      .update({
        marked_as_seen: true
      });

    return docRef;
  });

  return Promise.all(promises);
};

export function getMaintenanceNotification() {
  return function(dispatch) {
    return apiService
      .get(`maintenances/active`)
      .then(response => {
        dispatch({ type: TYPES.GET_MAINTENANCE_SUCCESS, payload: response });
      })
      .catch(error => {
        dispatch({ type: TYPES.GET_MAINTENANCE_SUCCESS, payload: { data: null } });
      });
  };
}
