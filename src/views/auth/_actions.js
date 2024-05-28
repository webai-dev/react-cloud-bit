import * as TYPES from './_types';
import * as USER_TYPES from 'views/user/_types';
import { apiService, setToken } from 'utils/api';
import { deleteCookie } from 'utils/storage';
import { successHandler, errorHandler, MSG } from 'utils/alerts';

export function logoutUser() {
  return function(dispatch) {
    deleteCookie('token');

    dispatch({ type: TYPES.UNAUTH_USER });
  };
}

export function apparatusLogin(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.APPARATUS_LOGIN });
    return apiService
      .post('/apparatus', params)
      .then(response => {
        setToken(response.data.token);
        dispatch({
          type: TYPES.APPARATUS_LOGIN_SUCCESS,
          payload: { token: response.data.token, directive_id: response.data.directive_id }
        });
        dispatch({
          type: USER_TYPES.FETCH_USER_SUCCESS,
          payload: response.data.user
        });
      })
      .catch(error => {
        dispatch({ type: TYPES.APPARATUS_LOGIN_ERROR });
        errorHandler(dispatch, MSG.APPARATUS_LOGIN_ERROR);
      });
  };
}

export function apparatusGetLogin(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.SECURE_APPARATUS_LOGIN });

    return apiService
      .get('/apparatus', params)
      .then(response => {
        dispatch({ type: TYPES.SECURE_APPARATUS_LOGIN_SUCCESS });

        return response.data.token;
      })
      .catch(error => {
        dispatch({ type: TYPES.SECURE_APPARATUS_LOGIN_ERROR });
      });
  };
}

export function apparatusMagicSucceed(msg) {
  return dispatch => {
    dispatch({ type: TYPES.APPARATUS_MAGIC_SUCCESS });
    successHandler(dispatch, msg);
  };
}

export function apparatusMagicFailed(error) {
  return dispatch => {
    dispatch({ type: TYPES.APPARATUS_MAGIC_FAILURE });
    console.log(error, error.apparatus_error);
    errorHandler(dispatch, {
      data: {
        error:
          error.apparatus_error && error.apparatus_error.code
            ? error.apparatus_error.code
            : error.code,
        message:
          error.apparatus_error && error.apparatus_error.message
            ? error.apparatus_error.message
            : error.message
      }
    });
  };
}

export function sendMagicLink(data) {
  return dispatch => {
    dispatch({ type: TYPES.APPARATUS_MAGIC_SEND });
    return apiService
      .post('apparatus/magic-link', data)
      .then(() => {
        dispatch(apparatusMagicSucceed(MSG.APPARATUS_LINK_SUCCESS));
      })
      .catch(error => {
        const { apparatus_error } = error.data;
        if (apparatus_error && apparatus_error === 'user_must_accept_terms') {
          throw error;
        } else {
          dispatch(apparatusMagicFailed(error.data));
        }
      });
  };
}

export function magicLinkLogin(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.MAGIC_LINK_LOGIN });

    return apiService
      .post('/magic-link', params)
      .then(response => {
        setToken(response.data.token);
        dispatch({
          type: TYPES.MAGIC_LINK_LOGIN_SUCCESS,
          payload: { token: response.data.token }
        });
        dispatch({
          type: USER_TYPES.FETCH_USER_SUCCESS,
          payload: response.data.user
        });

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.MAGIC_LINK_LOGIN_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export const acceptApparatusTerms = params => dispatch => {
  dispatch({ type: TYPES.ACCEPT_APPARATUS_TERMS });

  return apiService
    .post('/apparatus/accept-terms', params)
    .then(res => {
      dispatch({
        type: TYPES.ACCEPT_APPARATUS_TERMS_SUCCESS
      });
      return res.data;
    })
    .catch(error => dispatch({ type: TYPES.ACCEPT_APPARATUS_TERMS_ERROR, payload: error }));
};
