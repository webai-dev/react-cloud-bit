import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function fetchSandboxTypes() {
  return dispatch => {
    dispatch({ type: TYPES.FETCH_SANDBOX_TYPES });

    apiService
      .get('sandbox/types')
      .then(response => {
        dispatch({
          type: TYPES.FETCH_SANDBOX_TYPES_SUCCESS,
          payload: {
            types: response.data
          }
        });
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_SANDBOX_TYPES_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function createSandboxType(params) {
  return dispatch => {
    dispatch({ type: TYPES.CREATE_SANDBOX_TYPE });

    return apiService
      .post('sandbox/types', params)
      .then(response => {
        successHandler(dispatch, MSG.TYPE_CREATED);

        dispatch({ type: TYPES.CREATE_SANDBOX_TYPE_SUCCESS, payload: { type: response.data } });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_SANDBOX_TYPE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteSandboxType(typeId) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_SANDBOX_TYPE });

    return apiService
      .delete(`sandbox/types/${typeId}`)
      .then(response => {
        successHandler(dispatch, MSG.TYPE_DELETED);

        dispatch({ type: TYPES.DELETE_SANDBOX_TYPE_SUCCESS, payload: { typeId } });
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_SANDBOX_TYPE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function editSandboxType(id, params) {
  return dispatch => {
    dispatch({ type: TYPES.EDIT_SANDBOX_TYPE });

    return apiService
      .put(`sandbox/types/${id}`, params)
      .then(response => {
        successHandler(dispatch, MSG.TYPE_EDITED);

        dispatch({ type: TYPES.EDIT_SANDBOX_TYPE_SUCCESS, payload: { type: response.data } });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.EDIT_SANDBOX_TYPE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function createSandboxInstance(typeId, params) {
  return dispatch => {
    dispatch({ type: TYPES.CREATE_SANDBOX_INSTANCE });

    return apiService
      .post(`sandbox/types/${typeId}/instances`, params)
      .then(response => {
        dispatch({
          type: TYPES.CREATE_SANDBOX_INSTANCE_SUCCESS,
          payload: { instance: response.data }
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_SANDBOX_INSTANCE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function editSandboxInstance(typeId, instanceId, params) {
  return dispatch => {
    dispatch({ type: TYPES.EDIT_SANDBOX_INSTANCE });

    return apiService
      .put(`sandbox/types/${typeId}/instances/${instanceId}`, params)
      .then(response => {
        dispatch({
          type: TYPES.EDIT_SANDBOX_INSTANCE_SUCCESS,
          payload: { instance: response.data }
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.EDIT_SANDBOX_INSTANCE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteSandboxInstance(typeId, instanceId) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_SANDBOX_INSTANCE });

    return apiService
      .delete(`sandbox/types/${typeId}/instances/${instanceId}`)
      .then(response => {
        dispatch({
          type: TYPES.DELETE_SANDBOX_INSTANCE_SUCCESS,
          payload: { typeId, instanceId }
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_SANDBOX_INSTANCE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}
