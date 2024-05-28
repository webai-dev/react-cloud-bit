import * as TYPES from './_types';
import * as FILE_TYPES from 'views/files/_types';
import * as BIT_TYPES from 'views/bits/_types';

const INITIAL_STATE = {
  files: [],
  bits: [],
  loading: true
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_LOCKED_ITEMS_ERROR:
      if (action.payload.params.type === 'files') {
        return { ...state, files: [] };
      } else if (action.payload.params.type === 'bits') {
        return { ...state, bits: [] };
      }

      return state;

    case TYPES.FETCH_LOCKED_ITEMS_SUCCESS:
      if (action.payload.params.type === 'files') {
        return {
          ...state,
          files: action.payload.data.map(x => {
            return { ...x, is_locked: 1 };
          })
        };
      } else if (action.payload.params.type === 'bits') {
        return {
          ...state,
          bits: action.payload.data.map(x => {
            return { ...x, is_locked: 1 };
          })
        };
      }

      return state;

    case TYPES.LOCK_ITEM:
    case TYPES.LOCK_ITEM_ERROR:
      return {
        ...state,
        [action.payload.params.type]: state[action.payload.params.type].filter(x => {
          return x.id !== action.payload.params.id;
        })
      };

    case TYPES.SET_LOADING_STATUS:
      return { ...state, loading: action.payload };

    case FILE_TYPES.DELETE_FILE_SUCCESS:
      return {
        ...state,
        files: state.files.filter(x => {
          return x.id !== action.payload.params.id;
        })
      };

    case BIT_TYPES.DELETE_BIT_SUCCESS:
      return {
        ...state,
        bits: state.bits.filter(x => {
          return x.id !== action.payload.params.id;
        })
      };

    case BIT_TYPES.EDIT_BIT_SUCCESS:
      return {
        ...state,
        bits: state.bits.map((item, index) => {
          if (item.id !== action.payload.params.id) {
            return item;
          }

          return {
            ...item,
            ...action.payload.bit
          };
        })
      };

    case FILE_TYPES.FETCH_FILE_VERSIONS_SUCCESS:
      return {
        ...state,
        files: state.files.map((item, index) =>
          item.id === action.payload.params.id
            ? {
                ...item,
                versions: action.payload.data
              }
            : item
        )
      };

    default:
      return state;
  }
}
