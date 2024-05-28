import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler } from 'utils/alerts';

export function fetchRoles(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_ROLES });

    return apiService
      .get(`roles`)
      .then(response => {
        dispatch({ type: TYPES.FETCH_ROLES_SUCCESS, payload: response.data });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_ROLES_ERROR });
        errorHandler(dispatch, error);
      });
  };
}

export function fetchCurrentUserRole(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_CURRENT_USER_ROLE });

    return apiService
      .get(`roles/${params.team_id}`)
      .then(response => {
        dispatch({ type: TYPES.FETCH_CURRENT_USER_ROLE_SUCCESS, payload: response.data });

        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_CURRENT_USER_ROLE_ERROR });
        errorHandler(dispatch, error);
      });
  };
}
