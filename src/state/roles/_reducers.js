import * as TYPES from './_types';

const INITIAL_STATE = [];

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_ROLES_SUCCESS:
      const member = action.payload.find(i => i.label === 'member');
      const admin = action.payload.find(i => i.label === 'admin');

      return [member, admin, ...action.payload.filter(i => i !== member && i !== admin)];
    default:
      return state;
  }
}
