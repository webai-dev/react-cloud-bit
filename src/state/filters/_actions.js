import { apiService } from 'utils/api';
import { errorHandler } from 'utils/alerts';

import * as TYPES from './_types';

export function filtersSortChange(option) {
  return { type: TYPES.FILTERS_SORT_CHANGE, payload: { option } };
}

export function filtersOrderChange(newOrder) {
  return { type: TYPES.FILTERS_ORDER_CHANGE, payload: { newOrder } };
}

export function filtersCollapseChange(newCollapse) {
  return { type: TYPES.FILTERS_COLLAPSE_CHANGE, payload: { newCollapse } };
}

export function filtersExpandCollapse(itemType) {
  return dispatch => {
    dispatch({ type: TYPES.FILTERS_EXPAND_COLLAPSE, payload: { itemType } });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function filtersFillGaps(value) {
  return { type: TYPES.FILTERS_FILL_GAPS, payload: { value } };
}

export function fetchFolderFilters(params) {
  return function(dispatch) {
    dispatch({ type: TYPES.FETCH_FILTERS });
    if (!params.is_shares) params.is_shares = false;
    return apiService
      .get('filters', { params })
      .then(response => {
        dispatch({ type: TYPES.FETCH_FILTERS_SUCCESS, payload: response.data });
      })
      .catch(error => {
        dispatch({ type: TYPES.FETCH_FILTERS_ERROR });
        errorHandler(dispatch, error);
      });
  };
}
