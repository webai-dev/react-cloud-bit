import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function fetchShares(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_SHARES, payload: { params: params } });

    return apiService
      .get(`shares`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_SHARES_SUCCESS,
          payload: { data: response.data, params: params }
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_SHARES_ERROR, payload: { params: params } });
        errorHandler(dispatch, error);
      });
  };
}

export function createShare(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.CREATE_SHARE });

    return apiService
      .post(`shares`, params)
      .then(response => {
        dispatch({
          type: TYPES.CREATE_SHARE_SUCCESS,
          payload: { data: response.data, params: params }
        });
        successHandler(dispatch, MSG.SHARE_CREATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_SHARE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function unshareWithTeam(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.UNSHARE_WITH_TEAM });
    return apiService
      .delete(`shares/team`, { params })
      .then(response => {
        dispatch({
          type: TYPES.UNSHARE_WITH_TEAM_SUCCESS,
          payload: { data: response.data, params: params }
        });
        successHandler(dispatch, MSG.UNSHARED_WITH_EVERYONE);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.UNSHARE_WITH_TEAM_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function removeFromShared(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.BULK_REMOVE_FROM_SHARED });

    return apiService
      .delete(`shares/bulk`, { params })
      .then(response => {
        dispatch({
          type: TYPES.BULK_REMOVE_FROM_SHARED_SUCCESS,
          payload: params
        });
        successHandler(dispatch, MSG.SHARE_ACCESS_REMOVED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.BULK_REMOVE_FROM_SHARED_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function createBulkShare(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.CREATE_BULK_SHARE });

    return apiService
      .post(`shares/bulk`, params)
      .then(response => {
        dispatch({
          type: TYPES.CREATE_BULK_SHARE_SUCCESS,
          payload: { params, data: response.data }
        });
        successHandler(dispatch, MSG.SHARE_CREATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_BULK_SHARE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchSharePermissions(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_SHARE_PERMISSIONS });

    return apiService
      .get(`shares/permissions`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_SHARE_PERMISSIONS_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_SHARE_PERMISSIONS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchShare(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_SHARE });

    return apiService
      .get(`shares/${params.id}`, {})
      .then(response => {
        dispatch({
          type: TYPES.FETCH_SHARE_SUCCESS,
          payload: { data: response.data, id: params.id }
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_SHARE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function editShare(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.EDIT_SHARE });

    return apiService
      .put(`shares/${params.id}`, params)
      .then(response => {
        dispatch({
          type: TYPES.EDIT_SHARE_SUCCESS,
          payload: { params: params, share: response.data }
        });
        successHandler(dispatch, MSG.SHARE_UPDATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.EDIT_SHARE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteShare(params) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_SHARE });

    return apiService
      .delete(`shares/${params.id}`, {})
      .then(response => {
        dispatch({
          type: TYPES.DELETE_SHARE_SUCCESS,
          payload: { params: params, data: response.data }
        });
        successHandler(dispatch, MSG.SHARE_ACCESS_REMOVED);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_SHARE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function selectSharedFile(params) {
  return dispatch => {
    dispatch({ type: TYPES.SELECT_SHARED_FILE, payload: params });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function selectSharedBit(params) {
  return dispatch => {
    dispatch({ type: TYPES.SELECT_SHARED_BIT, payload: params });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function selectSharedFolder(params) {
  return dispatch => {
    dispatch({ type: TYPES.SELECT_SHARED_FOLDER, payload: params });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function setLoadingStatus(params) {
  return dispatch => {
    dispatch({ type: TYPES.SET_LOADING_STATUS, payload: params });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}
