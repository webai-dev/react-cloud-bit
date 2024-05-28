import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function createPin(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.CREATE_PIN });

    return apiService
      .post(`pins`, params)
      .then(response => {
        dispatch({ type: TYPES.CREATE_PIN_SUCCESS, payload: response.data });
        successHandler(dispatch, MSG.PIN_CREATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_PIN_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function editPin(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.EDIT_PIN });

    return apiService
      .put(`pins/${params.id}`, params)
      .then(response => {
        dispatch({
          type: TYPES.EDIT_PIN_SUCCESS,
          payload: { params: params, bit: response.data }
        });
        successHandler(dispatch, MSG.PIN_UPDATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.EDIT_PIN_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchPin(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_PIN });
    return apiService
      .get(`pins/${params.id}`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_PIN_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_PIN_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function favouritePin(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FAVOURITE_PIN });

    return apiService
      .put(`pins/${params.id}/favourite`, params)
      .then(response => {
        dispatch({ type: TYPES.FAVOURITE_PIN_SUCCESS, payload: params.id });
        successHandler(dispatch, MSG.PIN_FAVOURITES_UPDATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FAVOURITE_PIN_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function getPins(params) {
  return dispatch => {
    dispatch({ type: TYPES.FETCH_PINS });
    return apiService
      .get(`pins`, { params })
      .then(response => {
        dispatch({ type: TYPES.FETCH_PINS_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_PINS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function loadMorePins(params) {
  return (dispatch, state) => {
    const page = state().pinboard.currentPage + 1;
    const pinParams = { ...params, page };
    dispatch({ type: TYPES.LOAD_MORE_PINS });

    return apiService
      .get(`pins`, { params: pinParams })
      .then(response => {
        dispatch({ type: TYPES.LOAD_MORE_PINS_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.LOAD_MORE_PINS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchPinTypes(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_PIN_TYPES });

    return apiService
      .get(`pins/types`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_PIN_TYPES_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_PIN_TYPES_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deletePin(params) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_PIN });

    return apiService
      .delete(`pins/${params.id}`, { params })
      .then(response => {
        dispatch({
          type: TYPES.DELETE_PIN_SUCCESS,
          payload: { params: params, pin: response.data }
        });
        successHandler(dispatch, MSG.PIN_DELETED);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_PIN_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function toggleFavorites() {
  return function(dispatch) {
    dispatch({ type: TYPES.TOGGLE_FAVORITES });
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
