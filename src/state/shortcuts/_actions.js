import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function createShortcut(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.CREATE_SHORTCUT });
    return apiService
      .post(`shortcuts`, params)
      .then(response => {
        dispatch({
          type: TYPES.CREATE_SHORTCUT_SUCCESS,
          payload: { params: { ...params, is_shortcut: true }, data: response.data }
        });

        successHandler(dispatch, MSG.CREATE_SHORTCUT_SUCCESS);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_SHORTCUT_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteShortcut(params) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_SHORTCUT });

    return apiService
      .delete(`shortcuts/${params.shortcut_id}`, {})
      .then(response => {
        dispatch({
          type: TYPES.DELETE_SHORTCUT_SUCCESS,
          payload: { params: params, data: response.data }
        });
        successHandler(dispatch, MSG.DELETE_SHORTCUT_SUCCESS);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_SHORTCUT_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function moveShortcut(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.MOVE_SHORTCUT });

    return apiService
      .put(`shortcuts/${params.shortcut_id}/move`, params)
      .then(response => {
        dispatch({
          type: TYPES.MOVE_SHORTCUT_SUCCESS,
          payload: { params: params, item: { id: params.id, folder_id: params.folder_id } }
        });
        successHandler(dispatch, MSG.MOVE_SHORTCUT_SUCCESS);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.MOVE_SHORTCUT_ERROR });
        errorHandler(dispatch, error);
      });
  };
}
