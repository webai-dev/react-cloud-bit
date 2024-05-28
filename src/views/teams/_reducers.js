import * as TYPES from './_types';
import * as SHOP_TYPES from 'views/marketplace/store/_types';

const INITIAL_STATE = {
  list: [],
  active: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_TEAMS:
    case TYPES.FETCH_TEAMS_ERROR:
      return state;
    case TYPES.FETCH_TEAMS_SUCCESS:
      return { ...state, list: action.payload };

    case TYPES.CREATE_TEAM:
    case TYPES.CREATE_TEAM_ERROR:
      return state;
    case TYPES.CREATE_TEAM_SUCCESS:
      return { ...state, list: [...state.list, action.payload] };

    case TYPES.EDIT_TEAM_SUCCESS:
      return {
        ...state,
        active: action.payload.team,
        list: state.list.map((item, index) => {
          if (item.id !== action.payload.params.id) {
            return item;
          }

          return action.payload.team;
        })
      };
    case SHOP_TYPES.PAY_INVOICE_SUCCESS:
      return {
        ...state,
        active: {
          ...state.active,
          locked: false
        }
      };
    case TYPES.DELETE_TEAM_SUCCESS:
      return state;

    case TYPES.SET_ACTIVE_TEAM_SUCCESS:
      return { ...state, active: action.payload };

    case TYPES.SET_ACTIVE_TEAM_ERROR:
      return { ...state, active: {} };

    default:
      return state;
  }
}
