import * as TYPES from './_types';

const INITIAL_STATE = {
  sortBy: 'alphabetical_ascending',
  order: {
    bits: 0,
    folders: 1,
    files: 2
  },
  collapse: {
    bits: false,
    folders: false,
    files: false
  },
  fillGaps: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FILTERS_SORT_CHANGE:
      return {
        ...state,
        sortBy: action.payload.option
      };
    case TYPES.FILTERS_ORDER_CHANGE:
      return {
        ...state,
        order: action.payload.newOrder
      };
    case TYPES.FILTERS_COLLAPSE_CHANGE:
      return {
        ...state,
        collapse: action.payload.newCollapse
      };
    case TYPES.FILTERS_EXPAND_COLLAPSE:
      return {
        ...state,
        collapse: {
          ...state.collapse,
          [action.payload.itemType]: false
        }
      };
    case TYPES.FILTERS_FILL_GAPS:
      return {
        ...state,
        fillGaps: action.payload.value
      };
    case TYPES.FETCH_FILTERS_SUCCESS:
      const options = action.payload;
      return {
        ...state,
        sortBy: options.sort_by,
        order: {
          bits: options.bits_order,
          folders: options.folders_order,
          files: options.files_order
        },
        collapse: {
          bits: options.bits_collapse,
          folders: options.folders_collapse,
          files: options.files_collapse
        },
        fillGaps: options.fill_gaps
      };
    default:
      return state;
  }
}
