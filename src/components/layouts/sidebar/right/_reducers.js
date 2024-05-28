import * as TYPES from './_types';

const INITIAL_STATE = {
  show: false,
  activeTab: 'filter',
  mode: '',
  data: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SIDEBAR_VISIBILITY_CHANGE:
      const show =
        state.show === false ? true : action.payload.activeTab === state.activeTab ? false : true;
      return {
        ...state,
        data: action.payload.data,
        show,
        activeTab: action.payload.activeTab
      };
    case TYPES.TOGGLE_DETAILS:
      if (
        state.show &&
        action.payload.fileId === state.data.fileId &&
        state.activeTab === 'file_details'
      )
        return {
          ...state,
          show: false,
          mode: action.payload.mode
        };
      else
        return {
          ...state,
          activeTab: 'file_details',
          mode: action.payload.mode,
          data: { fileId: action.payload.fileId },
          show: true
        };
    case '@@router/LOCATION_CHANGE':
    case TYPES.HIDE_SIDEBAR:
      return {
        ...state,
        show: false
      };
    default:
      return state;
  }
}
