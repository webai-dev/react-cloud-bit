import * as TYPES from './_types';

export default (state = { dismiss: false }, action) => {
  switch (action.type) {
    case TYPES.DISMISS_BANNER:
      return { ...state, dismiss: true };
    default:
      return state;
  }
};
