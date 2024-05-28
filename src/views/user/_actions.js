import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function fetchUser(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_USER });

    return apiService
      .get(`account`)
      .then(response => {
        dispatch({ type: TYPES.FETCH_USER_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_USER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function editUser(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.EDIT_USER });

    return apiService
      .put(`account`, params)
      .then(response => {
        dispatch({
          type: TYPES.EDIT_USER_SUCCESS,
          payload: response.data
        });
        successHandler(dispatch, MSG.USER_ACCOUNT_UPDATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.EDIT_USER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

// Maybe dont edit the user in the same action ?
export function syncUser(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.SYNC_USER });

    return apiService
      .post(`apparatus/sync`, params)
      .then(response => {
        dispatch({
          type: TYPES.SYNC_USER_SUCCESS,
          payload: response.data.user
        });
        successHandler(dispatch, MSG.USER_SYNC_SUCCESS);
        return response.data;
      })
      .catch(error => {
        errorHandler(dispatch);
        dispatch({ type: TYPES.SYNC_USER_ERROR });
      });
  };
}

export function deleteUser(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.DELETE_USER });

    return apiService
      .delete('account')
      .then(response => {
        dispatch({
          type: TYPES.DELETE_USER_SUCCESS
        });

        dispatch({ type: TYPES.UNAUTH_USER });
        successHandler(dispatch, MSG.USER_DELETED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.EDIT_USER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export const acceptTerms = params => {
  return dispatch => {
    dispatch({ type: TYPES.ACCEPT_TERMS });

    return apiService
      .post(`/account/accept-terms`, params)
      .then(response => {
        dispatch({
          type: TYPES.ACCEPT_TERMS_SUCCESS
        });
      })
      .catch(error => {
        dispatch({ type: TYPES.ACCEPT_TERMS_ERROR, payload: error });
      });
  };
};
