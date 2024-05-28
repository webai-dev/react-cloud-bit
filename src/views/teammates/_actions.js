import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';
import { fetchUser } from 'views/user/_actions';

export function fetchTeamMembers(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_TEAM_MEMBERS });

    return apiService
      .get(`teams/${params.team_id}/users`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_TEAM_MEMBERS_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_TEAM_MEMBERS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchTeamInvitedMembers(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_TEAM_INVITED_MEMBERS });

    return apiService
      .get(`teams/${params.team_id}/invitations`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_TEAM_INVITED_MEMBERS_SUCCESS,
          payload: response.data
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_TEAM_INVITED_MEMBERS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function inviteTeamMember(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.INVITE_TEAM_MEMBER });
    return apiService
      .post(`invitations`, params)
      .then(response => {
        dispatch({ type: TYPES.INVITE_TEAM_MEMBER_SUCCESS });
        successHandler(dispatch, MSG.INVITATION_SENT);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.INVITE_TEAM_MEMBER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteMember(params) {
  return dispatch => {
    dispatch({ type: TYPES.DELETE_TEAM_MEMBER });

    return apiService
      .delete(`/teams/${params.id}/users/${params.user_id}`, {})
      .then(response => {
        dispatch({
          type: TYPES.DELETE_TEAM_MEMBER_SUCCESS,
          payload: { params: params, data: response.data }
        });
        successHandler(dispatch, MSG.MEMBER_REMOVED);

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_TEAM_MEMBER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function updateMember(params) {
  return function(dispatch, getState) {
    dispatch({ type: TYPES.UPDATE_TEAM_MEMBER });

    const currentUser = getState().user;

    let url;
    let successMsg;
    if (params.hasOwnProperty('role_id')) {
      url = `teams/${params.team_id}/users/${params.user_id}`;
      successMsg = MSG.MEMBER_ROLE_UPDATED;
    } else if (params.hasOwnProperty('developer')) {
      url = `teams/${params.team_id}/users/${params.user_id}/developer`;
      successMsg = MSG.MEMBER_DEV_ROLE_UPDATED;
    } else {
      return;
    }

    return apiService
      .put(url, params)
      .then(response => {
        if (currentUser.id === params.user_id) {
          dispatch(fetchUser());
        }

        dispatch({
          type: TYPES.UPDATE_TEAM_MEMBER_SUCCESS,
          payload: params
        });

        successHandler(dispatch, successMsg);
      })
      .catch(error => {
        dispatch({ type: TYPES.UPDATE_TEAM_MEMBER_ERROR });
        errorHandler(dispatch, error);
      });
  };
}
