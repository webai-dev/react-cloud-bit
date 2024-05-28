import * as TYPES from './_types';
import * as INV_TYPES from 'views/invitations/_types';

const INITIAL_STATE = {
  list: [],
  invited: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_TEAM_MEMBERS_ERROR:
      return { ...state, list: [] };
    case TYPES.FETCH_TEAM_MEMBERS_SUCCESS:
      return { ...state, list: action.payload };

    case TYPES.FETCH_TEAM_INVITED_MEMBERS:
    case TYPES.FETCH_TEAM_INVITED_MEMBERS_ERROR:
      return { ...state, invited: [] };
    case TYPES.FETCH_TEAM_INVITED_MEMBERS_SUCCESS:
      return { ...state, invited: action.payload };

    case TYPES.DELETE_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        list: state.list.filter((item, index) => {
          return item.id !== action.payload.params.user_id;
        })
      };

    case TYPES.UPDATE_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        list: state.list.map((item, index) => {
          if (item.id !== action.payload.user_id) {
            return item;
          }

          return {
            ...item,
            ...action.payload
          };
        })
      };

    case INV_TYPES.DELELE_INVITATION_SUCCESS:
      return {
        ...state,
        invited: state.invited.filter((item, index) => {
          return item.id !== action.payload.params.id;
        })
      };

    default:
      return state;
  }
}
