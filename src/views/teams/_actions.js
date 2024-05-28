import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';

export function fetchTeams(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_TEAMS });
    return apiService
      .get(`teams`)
      .then(response => {
        dispatch({ type: TYPES.FETCH_TEAMS_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_TEAMS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function createTeam(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.CREATE_TEAM });

    return apiService
      .post(`teams`, params)
      .then(response => {
        dispatch({ type: TYPES.CREATE_TEAM_SUCCESS, payload: response.data });
        successHandler(dispatch, MSG.TEAM_CREATED(response.data.name));
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.CREATE_TEAM_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function editTeam(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.EDIT_TEAM });

    return apiService
      .put(`teams/${params.id}`, params)
      .then(response => {
        dispatch({
          type: TYPES.EDIT_TEAM_SUCCESS,
          payload: { params: params, team: response.data }
        });
        successHandler(dispatch, MSG.TEAM_UPDATED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.EDIT_TEAM_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function deleteTeam(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.DELETE_TEAM });

    return apiService
      .delete(`teams/${params.id}`)
      .then(response => {
        dispatch({
          type: TYPES.DELETE_TEAM_SUCCESS,
          payload: { params: params, team: response.data }
        });
        fetchTeams();
        successHandler(dispatch, MSG.TEAM_DELETED);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.DELETE_TEAM_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function leaveTeam(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.LEAVE_TEAM });

    return apiService
      .delete(`teams/${params.id}/users/${params.user_id}`)
      .then(response => {
        dispatch({
          type: TYPES.LEAVE_TEAM_SUCCESS,
          payload: response.data
        });

        successHandler(dispatch, MSG.TEAM_LEFT);
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.LEAVE_TEAM_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function setActiveTeam(subdomain, teams) {
  return dispatch => {
    const team = teams.find(o => o.subdomain == subdomain);
    if (team) {
      dispatch({ type: TYPES.SET_ACTIVE_TEAM_SUCCESS, payload: team });

      return new Promise(function(resolve, reject) {
        resolve(team);
      });
    } else {
      return new Promise(function(resolve, reject) {
        errorHandler(dispatch, {
          data: { error: 'TeamMembershipException', message: MSG.NOT_IN_TEAM }
        });
        reject('Team not found');
      });
    }
  };
}
