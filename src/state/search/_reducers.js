import * as TYPES from './_types';
import * as FILE_TYPES from 'views/files/_types';

const INITIAL_STATE = {
  dropdown: [],
  index: {
    files: []
  }
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.CLEAR_TEAM_SEARCH:
      return {
        ...state,
        [action.payload.params.type]: []
      };

    case TYPES.FETCH_TEAM_SEARCH_SUCCESS:
      return {
        ...state,
        [action.payload.params.type]: action.payload.data
      };

    case FILE_TYPES.FETCH_FILE_VERSIONS_SUCCESS:
      return {
        ...state,
        index: {
          ...state.index,
          files: state.index.files.map((item, index) =>
            item.id === action.payload.params.id
              ? {
                  ...item,
                  versions: action.payload.data
                }
              : item
          )
        }
      };

    default:
      return state;
  }
}
