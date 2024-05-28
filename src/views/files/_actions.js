import axios from 'axios';
import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function selectFile(params) {
  return dispatch => {
    dispatch({ type: TYPES.SELECT_FILE, payload: params });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function fetchFolderFiles(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_FOLDER_FILES });
    return apiService
      .get(`files`, { params: params })
      .then(response => {
        dispatch({ type: TYPES.FETCH_FOLDER_FILES_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_FOLDER_FILES_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function createFile(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.CREATE_FILE });

    return apiService
      .post(`files`, params)
      .then(response => {
        let data = response.data;
        data.folder_id = parseInt(data.folder_id);
        data.team_id = parseInt(data.team_id);
        dispatch({ type: TYPES.CREATE_FILE_SUCCESS, payload: data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_FILE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function uploadFile(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.UPLOAD_FILE });

    return apiService
      .get(`files/path`, { params })
      .then(response => response.data)
      .then(data => {
        const options = {
          headers: {
            'Content-Type': params.data.type
          }
        };

        const token = axios.defaults.headers.common.Authorization;
        delete axios.defaults.headers.common.Authorization;

        const request = axios.put(data.presignedUrl, params.data, options).then(() => {
          return apiService
            .post('files/create', {
              folder_id: params.folder_id,
              filename: params.filename,
              extension: params.extension,
              path: data.fullPath
            })
            .then(response => {
              dispatch({ type: TYPES.UPLOAD_FILE_SUCCESS, payload: response.data });
              return response.data;
            });
        });

        axios.defaults.headers.common.Authorization = token;
        return request;
      })
      .catch(error => {
        dispatch({ type: TYPES.UPLOAD_FILE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function addCreatedFile(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.ADD_CREATED_FILE, payload: params });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function fetchFile(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_FILE });
    return apiService
      .get(`files/${params.file_id}`, { params })
      .then(response => {
        dispatch({ type: TYPES.FETCH_FILE_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_FILE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function renameFile(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.RENAME_FILE });

    return apiService
      .put(`files/${params.id}`, params)
      .then(response => {
        dispatch({
          type: TYPES.RENAME_FILE_SUCCESS,
          payload: { params: params, file: response.data }
        });
        successHandler(dispatch, MSG.FILE_UPDATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.RENAME_FILE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function copyFile(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.COPY_FILE });

    return apiService
      .put(`files/${params.id}/copy`, params)
      .then(response => {
        dispatch({
          type: TYPES.COPY_FILE_SUCCESS,
          payload: { params: params, file: response.data }
        });
        successHandler(dispatch, MSG.FILE_COPIED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.COPY_FILE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteFile(params) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_FILE });

    return apiService
      .delete(`files/${params.id}/trash`, { params })
      .then(response => {
        dispatch({
          type: TYPES.DELETE_FILE_SUCCESS,
          payload: { params: params, item: response.data }
        });
        successHandler(dispatch, MSG.FILE_DELETED);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_FILE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function moveFile(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.MOVE_FILE });

    return apiService
      .put(`files/${params.id}/move`, params)
      .then(response => {
        dispatch({
          type: TYPES.MOVE_FILE_SUCCESS,
          payload: { params: params, item: response.data.item }
        });
        successHandler(dispatch, 'File moved');
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.MOVE_FILE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function changeFileVersion(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.CHANGE_FILE_VERSION });

    return apiService
      .post(`files/${params.id}/versions`, params.data)
      .then(response => {
        dispatch({
          type: TYPES.CHANGE_FILE_VERSION_SUCCESS,
          payload: { params: params, data: response.data }
        });
        successHandler(dispatch, MSG.FILE_REPLACED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CHANGE_FILE_VERSION_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export const fetchFileVersions = params => dispatch => {
  dispatch({ type: TYPES.FETCH_FILE_VERSIONS });

  return apiService
    .get(`/files/${params.id}/versions`)
    .then(res => {
      dispatch({
        type: TYPES.FETCH_FILE_VERSIONS_SUCCESS,
        payload: { params, data: res.data }
      });
      return res.data;
    })
    .catch(error => {
      dispatch({ type: TYPES.FETCH_FILE_VERSIONS_ERROR });
      errorHandler(dispatch, error);
    });
};

export const fetchFileActivity = params => dispatch => {
  dispatch({ type: TYPES.FETCH_FILE_ACTIVITY });
  return apiService
    .get(`/files/${params.id}/activity?major=1`)
    .then(res => {
      dispatch({
        type: TYPES.FETCH_FILE_ACTIVITY_SUCCESS,
        payload: { params, data: res.data }
      });
      return res.data;
    })
    .catch(error => {
      dispatch({ type: TYPES.FETCH_FILE_ACTIVITY_ERROR });
      errorHandler(dispatch, error);
    });
};

export const addFileActivity = activity => {
  return {
    type: TYPES.ADD_FILE_ACTIVITY,
    activity
  };
};

export const setKeepForever = params => dispatch => {
  dispatch({ type: TYPES.SET_KEEP_FOREVER });

  return apiService
    .put(`files/${params.id}`, params)
    .then(response => {
      dispatch({
        type: TYPES.SET_KEEP_FOREVER_SUCCESS,
        payload: { params: params }
      });
      successHandler(dispatch, MSG.FILE_UPDATED);
      return response.data;
    })
    .catch(error => {
      dispatch({ type: TYPES.SET_KEEP_FOREVER_ERROR });
      errorHandler(dispatch, error);
    });
};

export const editFileVersion = params => dispatch => {
  dispatch({ type: TYPES.EDIT_FILE_VERSION });

  return apiService
    .put(`files/${params.fileId}/versions/${params.versionId}`, params)
    .then(response => {
      dispatch({ type: TYPES.EDIT_FILE_VERSION_SUCCESS, payload: { params, data: response.data } });
      successHandler(dispatch, MSG.FILE_VERSION_UPDATED);
      return response.data;
    })
    .catch(error => {
      dispatch({ type: TYPES.EDIT_FILE_VERSION_ERROR });
      errorHandler(dispatch, error);
    });
};

export const deleteFileVersion = params => dispatch => {
  dispatch({ type: TYPES.DELETE_FILE_VERSION });

  return apiService
    .delete(`files/${params.fileId}/versions/${params.versionId}`, { params })
    .then(response => {
      dispatch({
        type: TYPES.DELETE_FILE_VERSION_SUCCESS,
        payload: { params: params, item: response.data }
      });
      successHandler(dispatch, MSG.FILE_VERSION_DELETED);
      return response.data;
    })
    .catch(error => {
      dispatch({ type: TYPES.DELETE_FILE_VERSION_ERROR });
      errorHandler(dispatch, error);
    });
};

export function publishFile({ item_id, params }) {
  return function(dispatch) {
    dispatch({ type: TYPES.PUBLISH_FILE });
    return apiService
      .put(`files/${item_id}/publish`, params)
      .then(response => {
        dispatch({
          type: TYPES.PUBLISH_FILE_SUCCESS
        });
        successHandler(dispatch, MSG.PUBLIC_LINK_SENT);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.PUBLISH_FILE_ERROR });
        errorHandler(dispatch, MSG.INVALID_EMAIL);
      });
  };
}
