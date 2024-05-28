import * as TYPES from './_types';
import { apiService, apiBlobService } from 'utils/api';
import { errorHandler, infoHandler, successHandler, MSG } from 'utils/alerts';

export function bulkDownload(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.BULK_DOWNLOAD });
    infoHandler(dispatch, null, MSG.BULK_DOWNLOAD_STARTS_SOON);

    return apiBlobService
      .get(`bulk/download`, { params })
      .then(response => {
        dispatch({
          type: TYPES.BULK_DOWNLOAD_SUCCESS,
          payload: params
        });

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.BULK_DOWNLOAD_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function bulkMove(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.BULK_MOVE });
    infoHandler(dispatch, MSG.BULK_MOVING);

    return apiService
      .put(`bulk/move`, params)
      .then(response => {
        dispatch({
          type: TYPES.BULK_MOVE_SUCCESS,
          payload: params
        });

        successHandler(dispatch, MSG.BULK_MOVED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.BULK_MOVE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function bulkDelete(params) {
  return dispatch => {
    dispatch({ type: TYPES.BULK_DELETE });
    infoHandler(dispatch, MSG.BULK_DELETING);

    return apiService
      .delete(`bulk/trash`, { params })
      .then(response => {
        dispatch({
          type: TYPES.BULK_DELETE_SUCCESS,
          payload: params
        });
        successHandler(dispatch, MSG.BULK_DELETED);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.BULK_DELETE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}
