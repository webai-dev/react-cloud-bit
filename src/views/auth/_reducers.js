import * as TYPES from './_types';

const INITIAL_STATE = {
  authenticated: false,
  token: null,
  directive_id: null,
  loading: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.AUTH_USER:
      return {
        ...state,
        authenticated: true
      };
    case TYPES.UNAUTH_USER:
    case TYPES.APPARATUS_LOGIN_ERROR:
      return {
        ...state,
        authenticated: false,
        token: null
      };
    case TYPES.APPARATUS_LOGIN_SUCCESS:
    case TYPES.MAGIC_LINK_LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        token: action.payload.token,
        directive_id: action.payload.directive_id ? action.payload.directive_id : null
      };
    case TYPES.APPARATUS_MAGIC_SEND:
      return {
        ...state,
        loading: true
      };
    case TYPES.APPARATUS_MAGIC_SUCCESS:
    case TYPES.APPARATUS_MAGIC_FAILURE:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
