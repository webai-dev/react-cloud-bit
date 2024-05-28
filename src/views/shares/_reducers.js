import * as TYPES from './_types';
import * as FOLDER_TYPES from 'views/folders/_types';
import * as FILE_TYPES from 'views/files/_types';
import * as BIT_TYPES from 'views/bits/_types';
import * as LOCK_TYPES from 'views/dashboard/_types';
import * as BULK_TYPES from 'state/bulk/_types';
import * as SHORTCUT_TYPES from 'state/shortcuts/_types';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  bulkSelect,
  updateOnShare,
  updateOnUnshare,
  updateOnUnshareWithEveryone,
  updateOnBulkShare
} from 'state/bulk/_helpers';

const INITIAL_STATE = {
  active: null,
  permissions: { owner: {}, shares: [] },
  files: [], // Shared with me files
  bits: [], // Shared with me bits
  folders: [], // Shared with me folders
  selected: {
    // Shared with me selected
    folders: {
      start: null,
      list: []
    },
    bits: {
      start: null,
      list: []
    },
    files: {
      start: null,
      list: []
    }
  },
  loading: true
};

const types = ['folders', 'files', 'bits'];

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_SHARES_ERROR:
      if (action.payload.params.shareable_type === 'file') {
        return { ...state, files: [] };
      } else if (action.payload.params.shareable_type === 'bit') {
        return { ...state, bits: [] };
      } else {
        return { ...state, folders: [] };
      }

    case TYPES.FETCH_SHARES_SUCCESS:
      if (action.payload.params.shareable_type === 'file') {
        return { ...state, files: action.payload.data };
      } else if (action.payload.params.shareable_type === 'bit') {
        return { ...state, bits: action.payload.data };
      } else {
        return { ...state, folders: action.payload.data };
      }

    case TYPES.SET_LOADING_STATUS:
      return { ...state, loading: action.payload };

    case TYPES.FETCH_SHARE_PERMISSIONS:
    case TYPES.FETCH_SHARE_PERMISSIONS_ERROR:
      return {
        ...state,
        permissions: { owner: {}, shares: [] }
      };
    case TYPES.FETCH_SHARE_PERMISSIONS_SUCCESS:
      return {
        ...state,
        permissions: action.payload
      };

    case TYPES.CREATE_SHARE_SUCCESS:
      let type = action.payload.params.shareable_type;
      let key = type + 's';
      return {
        ...state,
        [key]: updateOnShare(action.payload, state[key])
      };
    case TYPES.DELETE_SHARE_SUCCESS:
      type = action.payload.data.shareable_type;
      key = type + 's';

      return {
        ...state,
        permissions: {
          ...state.permissions,
          shares: state.permissions.shares.filter(x => {
            return x.id !== action.payload.params.id;
          })
        },
        [key]: updateOnUnshare(action.payload, state[key])
      };

    case TYPES.UNSHARE_WITH_TEAM_SUCCESS:
      type = action.payload.data.shareable_type;
      key = type + 's';

      return {
        ...state,
        [key]: updateOnUnshareWithEveryone(action.payload, state[key])
      };
    case TYPES.CREATE_BULK_SHARE_SUCCESS:
      return {
        ...state,
        files: updateOnBulkShare(action.payload, state.files, 'file'),
        folders: updateOnBulkShare(action.payload, state.folders, 'folder'),
        bits: updateOnBulkShare(action.payload, state.bits, 'bit')
      };

    case TYPES.EDIT_SHARE_SUCCESS:
      const array = state.permissions.shares;
      let itemIndex = array.findIndex(x => x.id === action.payload.params.id);

      return {
        ...state,
        permissions: {
          ...state.permissions,
          shares: array.map((item, index) => {
            if (itemIndex !== index) {
              return item;
            }

            return {
              ...item,
              share: action.payload.share.share,
              edit: action.payload.share.edit
            };
          })
        }
      };

    case TYPES.BULK_REMOVE_FROM_SHARED_SUCCESS:
      let removed = {};

      types.forEach(type => {
        removed[type] = state[type].filter(x => {
          return action.payload.shares.indexOf(x.share.id) === -1;
        });
      });

      return { ...state, ...removed };

    case TYPES.SELECT_SHARED_FILE:
      return {
        ...state,
        selected: {
          ...state.selected,
          files: bulkSelect(action.payload, state.files, state.selected.files)
        }
      };

    case TYPES.SELECT_SHARED_BIT:
      return {
        ...state,
        selected: {
          ...state.selected,
          bits: bulkSelect(action.payload, state.bits, state.selected.bits)
        }
      };

    case TYPES.SELECT_SHARED_FOLDER:
      return {
        ...state,
        selected: {
          ...state.selected,
          folders: bulkSelect(action.payload, state.folders, state.selected.folders)
        }
      };

    case LOCATION_CHANGE:
    case BULK_TYPES.CLEAR_SELECTED:
      return {
        ...state,
        selected: {
          folders: {
            start: null,
            list: []
          },
          bits: {
            start: null,
            list: []
          },
          files: {
            start: null,
            list: []
          }
        }
      };

    case FOLDER_TYPES.RENAME_FOLDER_SUCCESS:
      const renamed_folder = state.folders.find(x => x.id === action.payload.params.id);

      if (renamed_folder) {
        return {
          ...state,
          folders: state.folders.map((x, index) => {
            if (x.id != action.payload.params.id) return x;

            return { ...action.payload.folder };
          })
        };
      }

      return state;

    case FILE_TYPES.RENAME_FILE_SUCCESS:
      return {
        ...state,
        files: state.files.map((item, index) => {
          if (item.id !== action.payload.params.id) {
            return item;
          }

          return {
            ...action.payload.file
          };
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

    case SHORTCUT_TYPES.CREATE_SHORTCUT_SUCCESS:
      const shortcut_type = action.payload.params.shareable_type + 's';
      const shortcut_share = state[shortcut_type].find(
        s => s.share.id === action.payload.params.share_id
      );

      if (shortcut_share) {
        return {
          ...state,
          [shortcut_type]: state[shortcut_type].map(s => {
            if (s.id !== shortcut_share.id) return s;

            return {
              ...s,
              shortcut_id: action.payload.data.id
            };
          })
        };
      }

      return state;

    case SHORTCUT_TYPES.DELETE_SHORTCUT_SUCCESS: // folders only
      const deleted_shortcut_type = action.payload.params.shareable_type + 's';
      const deleted_shortcut_share = state[deleted_shortcut_type].find(
        s => s.shortcut_id === action.payload.params.shortcut_id
      );

      if (deleted_shortcut_share) {
        const ne = state[deleted_shortcut_type].map(x => {
          if (deleted_shortcut_share.id !== x.id) return x;

          let new_share = {
            ...x,
            shortcut_id: null
          };
          delete new_share.is_shortcut;
          return new_share;
        });
        return {
          ...state,
          [deleted_shortcut_type]: ne
        };
      }

      return state;

    case LOCK_TYPES.LOCK_ITEM:
    case LOCK_TYPES.LOCK_ITEM_ERROR:
      return {
        ...state,
        [action.payload.params.type]: state[action.payload.params.type].map(x => {
          if (action.payload.params.id !== x.id) return x;

          return { ...x, is_locked: !x.is_locked };
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
