import * as TYPES from './_types';
import * as ROLE_TYPES from 'state/roles/_types';

import { deleteCookie } from 'utils/storage';

const INITIAL_STATE = {
  id: null,
  role: { label: 'initial' }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_USER:
      return state;

    case TYPES.FETCH_USER_SUCCESS:
    case TYPES.EDIT_USER_SUCCESS:
      return { ...state, ...action.payload };

    case TYPES.FETCH_USER_ERROR:
      return state;

    case TYPES.DELETE_USER:
      return state;

    case TYPES.DELETE_USER_SUCCESS:
      deleteCookie('token');
      deleteCookie('after_login');
      return {};

    case TYPES.DELETE_USER_ERROR:
      return state;

    case ROLE_TYPES.FETCH_CURRENT_USER_ROLE_SUCCESS:
      return {
        ...state,
        role: action.payload
      };

    case TYPES.ACCEPT_TERMS_SUCCESS:
      return {
        ...state,
        has_accepted_ybit_terms: true
      };

    default:
      return state;
  }
}
