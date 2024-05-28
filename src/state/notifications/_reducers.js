import * as TYPES from './_types';

const INITIAL_STATE = {
  init: false,
  team: {
    per_page: 10,
    list: [],
    init: false,
    unread_notifications: [],
    last_seen: null,
    last_seen_setting: false
  },
  maintenances: null
};

const filterNewNotifications = (state, new_notifications) => {
  return new_notifications.filter(n => state.findIndex(i => i.id === n.id) === -1);
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.INIT_FIREBASE_AUTH_SUCCESS:
      return {
        ...state,
        init: true
      };

    case TYPES.GET_USER_TEAM_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        team: {
          ...state.team,
          init: true,
          list: [...state.team.list, ...filterNewNotifications(state.team.list, action.payload)]
        }
      };

    case TYPES.GET_USER_TEAM_NEW_NOTIFICATIONS:
      const new_notifications = filterNewNotifications(state.team.list, action.payload);

      return {
        ...state,
        team: {
          ...state.team,
          list: [...new_notifications, ...state.team.list],
          unread_notifications: [
            ...state.team.unread_notifications,
            ...new_notifications.map(not => {
              return {
                category: not.category,
                id: not.id,
                subcategory: not.subcategory,
                timestamp: not.timestamp
              };
            })
          ]
        }
      };

    case TYPES.GET_USER_TEAM_UNREAD_NOTIFICATIONS:
      return {
        ...state,
        team: {
          ...state.team,
          unread_notifications: action.payload
        }
      };

    case TYPES.GET_USER_TEAM_LAST_SEEN_TIMESTAMP_SUCCESS:
      return {
        ...state,
        team: {
          ...state.team,
          last_seen: action.payload && action.payload.last_seen ? action.payload.last_seen : null
        }
      };

    case TYPES.SET_USER_TEAM_LAST_SEEN_TIMESTAMP:
      return {
        ...state,
        team: {
          ...state.team,
          last_seen_setting: true
        }
      };

    case TYPES.SET_USER_TEAM_LAST_SEEN_TIMESTAMP_SUCCESS:
      return {
        ...state,
        team: {
          ...state.team,
          last_seen: action.payload && action.payload.last_seen ? action.payload.last_seen : null,
          unread_notifications: [],
          last_seen_setting: false
        }
      };

    case TYPES.SET_USER_TEAM_LAST_SEEN_TIMESTAMP_ERROR:
      return {
        ...state,
        team: {
          ...state.team,
          last_seen_setting: false
        }
      };

    case TYPES.MARK_TEAM_NOTIFICATION_AS_SEEN_SUCCESS: {
      return {
        ...state,
        team: {
          ...state.team,
          unread_notifications: state.team.unread_notifications.filter(
            n => action.payload.indexOf(n.id) === -1
          )
        }
      };
    }

    case TYPES.GET_MAINTENANCE_SUCCESS: {
      return {
        ...state,
        maintenances: action.payload.data
      };
    }

    default:
      return state;
  }
}
