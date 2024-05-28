import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function fetchInvitations(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_INVITATIONS });
    return apiService
      .get(`invitations`, params)
      .then(response => {
        dispatch({
          type: TYPES.FETCH_INVITATIONS_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_INVITATIONS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function updateTeamInvitation(params) {
  const message = params.accepted ? MSG.INVITATION_ACCEPTED : MSG.INVITATION_DECLINED;

  return function(dispatch) {
    dispatch({ type: TYPES.UPDATE_INVITATION });
    return apiService
      .put(`invitations/${params.invitation_id}`, params)
      .then(response => {
        dispatch({
          type: TYPES.UPDATE_INVITATION_SUCCESS,
          payload: { id: params.invitation_id }
        });
        successHandler(dispatch, message);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.UPDATE_INVITATION_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteInvitation(params) {
  return dispatch => {
    dispatch({ type: TYPES.DELELE_INVITATION });

    return apiService
      .delete(`invitations/${params.id}`, {})
      .then(response => {
        dispatch({
          type: TYPES.DELELE_INVITATION_SUCCESS,
          payload: { params: params, data: response.data }
        });
        successHandler(dispatch, MSG.INVITATION_DELETED);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELELE_INVITATION_ERROR });
        errorHandler(dispatch, error);
      });
  };
}
