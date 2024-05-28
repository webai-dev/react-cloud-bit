import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function selectBit(params) {
  return dispatch => {
    dispatch({ type: TYPES.SELECT_BIT, payload: params });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function fetchBitTypes(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_BIT_TYPES });
    return apiService
      .get(`bits/types`, { params: params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_BIT_TYPES_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_BIT_TYPES_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function toggleBitTypes(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.TOGGLE_BIT_TYPE, payload: params });
    return apiService
      .put(`bits/types/${params.id}/toggle`)
      .then(response => {
        dispatch({
          type: TYPES.TOGGLE_BIT_TYPE_SUCCESS,
          payload: params
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.TOGGLE_BIT_TYPE_ERROR, payload: params });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchFolderBits(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_FOLDER_BITS });
    return apiService
      .get(`bits`, { params: params })
      .then(response => {
        dispatch({ type: TYPES.FETCH_FOLDER_BITS_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_FOLDER_BITS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function createBit(params) {
  return function(dispatch, getState) {
    const activeFolder = getState().folders.active;

    dispatch({ type: TYPES.CREATE_BIT });
    return apiService
      .post(`bits`, params)
      .then(response => {
        dispatch({
          type: TYPES.CREATE_BIT_SUCCESS,
          payload: {
            data: { ...response.data },
            inActiveFolder: activeFolder === response.data.folder_id
          }
        });
        successHandler(dispatch, MSG.BIT_CREATED(response.data.title));
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_BIT_ERROR });

        errorHandler(dispatch, error);
      });
  };
}

export function editBit(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.EDIT_BIT });

    return apiService
      .put(`bits/${params.id}`, params)
      .then(response => {
        dispatch({
          type: TYPES.EDIT_BIT_SUCCESS,
          payload: { params: params, bit: response.data }
        });
        successHandler(dispatch, MSG.BIT_UPDATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.EDIT_BIT_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchBit(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_BIT });
    return apiService
      .get(`bits/${params.bit_id}`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_BIT_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_BIT_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchBitDetails(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_BIT_DETAILS });
    return apiService
      .get(`bits/${params.bit_id}/details`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_BIT_DETAILS_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_BIT_DETAILS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchBitSchema(params) {
  return function(dispatch) {
    return apiService
      .get(`bits/types/${params.id}`, { params })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        errorHandler(dispatch, error);
      });
  };
}

export function deleteBit(params) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_BIT });

    return apiService
      .delete(`bits/${params.id}/trash`, { params })
      .then(response => {
        dispatch({
          type: TYPES.DELETE_BIT_SUCCESS,
          payload: { params: params, item: response.data }
        });
        successHandler(dispatch, MSG.BIT_DELETED);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_BIT_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function moveBit(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.MOVE_BIT });

    return apiService
      .put(`bits/${params.id}/move`, params)
      .then(response => {
        dispatch({
          type: TYPES.MOVE_BIT_SUCCESS,
          payload: { params: params, item: response.data.item }
        });
        successHandler(dispatch, MSG.BIT_MOVED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.MOVE_BIT_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export const fetchBitActivity = params => dispatch => {
  dispatch({ type: TYPES.FETCH_BIT_ACTIVITY });
  return apiService
    .get(`/bits/${params.id}/activity?major=1`)
    .then(res => {
      dispatch({
        type: TYPES.FETCH_BIT_ACTIVITY_SUCCESS,
        payload: { params, data: res.data }
      });
      return res.data;
    })
    .catch(error => {
      dispatch({ type: TYPES.FETCH_BIT_ACTIVITY_ERROR });
      errorHandler(dispatch, error);
    });
};

export const addBitActivity = activity => {
  return {
    type: TYPES.ADD_BIT_ACTIVITY,
    activity
  };
};
