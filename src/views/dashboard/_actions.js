import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function fetchLockedItems(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_LOCKED_ITEMS });
    return apiService
      .get(`${params.type}/locked`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_LOCKED_ITEMS_SUCCESS,
          payload: { data: response.data, params }
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_LOCKED_ITEMS_ERROR, payload: { params } });
        errorHandler(dispatch, error);
      });
  };
}

export function lockItem(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.LOCK_ITEM, payload: { params } });

    return apiService
      .put(`${params.type}/${params.id}/lock`, { params })
      .then(response => {
        dispatch({
          type: TYPES.LOCK_ITEM_SUCCESS,
          payload: { params: params, item: response.data }
        });

        let message;
        if (params.type === 'bits') {
          message = response.data.is_locked ? MSG.BIT_ADDED_TO_DASH : MSG.BIT_REMOVED_FROM_DASH;
        } else {
          message = response.data.is_locked ? MSG.FILE_ADDED_TO_DASH : MSG.FILE_REMOVED_FROM_DASH;
        }
        successHandler(dispatch, message);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.LOCK_ITEM_ERROR, payload: { params } });
        errorHandler(dispatch, error);
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
