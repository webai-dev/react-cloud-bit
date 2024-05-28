import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function setClickActiveFolder(folder) {
  return dispatch => {
    dispatch({ type: TYPES.SET_CLICK_ACTIVE_FOLDER, payload: folder });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function setCollapseFolder(folder) {
  return dispatch => {
    dispatch({ type: TYPES.SET_COLLAPSE_FOLDER, payload: folder });

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

export function selectFolder(params) {
  return dispatch => {
    dispatch({ type: TYPES.SELECT_FOLDER, payload: params });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function clearSelected() {
  return dispatch => {
    dispatch({ type: TYPES.CLEAR_SELECTED });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function collapseRootFolder() {
  return dispatch => {
    dispatch({ type: TYPES.COLLAPSE_ROOT_FOLDER });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function createFolder(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.CREATE_FOLDER });

    return apiService
      .post(`folders`, params)
      .then(response => {
        dispatch({
          type: TYPES.CREATE_FOLDER_SUCCESS,
          payload: { folder: response.data, params: params }
        });

        if (!params.drop) {
          successHandler(dispatch, MSG.FOLDER_CREATED(response.data.title));
        }

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_FOLDER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteFolder(params) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_FOLDER });

    return apiService
      .delete(`folders/${params.id}/trash`, { params })
      .then(response => {
        dispatch({
          type: TYPES.DELETE_FOLDER_SUCCESS,
          payload: { params: params }
        });
        successHandler(dispatch, MSG.FOLDER_DELETED);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_FOLDER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function renameFolder(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.RENAME_FOLDER });

    return apiService
      .put(`folders/${params.id}`, params)
      .then(response => {
        dispatch({
          type: TYPES.RENAME_FOLDER_SUCCESS,
          payload: { params: params, folder: response.data }
        });
        successHandler(dispatch, MSG.FOLDER_UPDATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.RENAME_FOLDER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchFolders(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_FOLDER_INDEX });

    return apiService
      .get(`folders`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_FOLDER_INDEX_SUCCESS,
          payload: { data: response.data, folder_id: params.folder_id, params }
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_FOLDER_INDEX_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function moveFolder(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.MOVE_FOLDER });

    return apiService
      .put(`folders/${params.id}/move`, params)
      .then(response => {
        dispatch({
          type: TYPES.MOVE_FOLDER_SUCCESS,
          payload: { params: params, folder: response.data.item, path: response.data.path }
        });
        successHandler(dispatch, MSG.FOLDER_MOVED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.MOVE_FOLDER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export const fetchFolderActivity = params => dispatch => {
  dispatch({ type: TYPES.FETCH_FOLDER_ACTIVITY });
  return apiService
    .get(`/folders/${params.id}/activity?major=1`)
    .then(res => {
      dispatch({
        type: TYPES.FETCH_FOLDER_ACTIVITY_SUCCESS,
        payload: { params, data: res.data }
      });
      return res.data;
    })
    .catch(error => {
      dispatch({ type: TYPES.FETCH_FOLDER_ACTIVITY_ERROR });
      errorHandler(dispatch, error);
    });
};

export const addFolderActivity = activity => {
  return {
    type: TYPES.ADD_FOLDER_ACTIVITY,
    activity
  };
};
