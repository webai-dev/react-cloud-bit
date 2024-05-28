import * as TYPES from './_types';
import { apiService } from 'utils/api';
import { errorHandler } from 'utils/alerts';

export function fetchTeamSearch(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_TEAM_SEARCH });

    // if (params && (!params.search || params.search === '')) {
    //   dispatch({ type: TYPES.CLEAR_TEAM_SEARCH, payload: { params } });

    //   return new Promise(function(resolve, reject) {
    //     resolve('Cleared!');
    //   });
    // }

    return apiService
      .get(`teams/${params.team_id}/search`, { params })
      .then(response => {
        dispatch({
          type: TYPES.FETCH_TEAM_SEARCH_SUCCESS,
          payload: { data: response.data, params: params }
        });
        return response.data;
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_TEAM_SEARCH_ERROR });
        errorHandler(dispatch, error);
      });
  };
}
