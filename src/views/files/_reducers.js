import * as TYPES from './_types';
import * as SHARES_TYPES from 'views/shares/_types';
import * as LOCK_TYPES from 'views/dashboard/_types';
import * as BULK_TYPES from 'state/bulk/_types';
import * as SHORTCUT_TYPES from 'state/shortcuts/_types';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  bulkSelect,
  bulkShare,
  teamShare,
  updateOnShare,
  updateOnUnshare,
  updateOnBulkShare,
  updateOnUnshareWithEveryone
} from 'state/bulk/_helpers';
import { removeFromState } from 'utils/state';

const INITIAL_STATE = {
  list: [],
  selected: {
    start: null,
    list: []
  },
  activity: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_FOLDER_FILES:
    case TYPES.FETCH_FOLDER_FILES_ERROR:
      return { ...state, list: [] };
    case TYPES.FETCH_FOLDER_FILES_SUCCESS:
      return {
        ...state,
        list: action.payload.map(item => ({
          ...item,
          preview_url: item.preview_url ? item.preview_url + '?t=' + new Date().getTime() : null
        }))
      };

    case TYPES.FETCH_FILE_SUCCESS:
      if (!action.payload.url)
        return {
          ...state,
          list: [action.payload]
        };
      else return state;

    case TYPES.RENAME_FILE_SUCCESS:
      return {
        ...state,
        list: state.list.map((item, index) => {
          if (item.id !== action.payload.params.id) {
            return item;
          }

          return {
            ...action.payload.file
          };
        })
      };

    case TYPES.DELETE_FILE_SUCCESS:
    case TYPES.MOVE_FILE_SUCCESS:
    case SHORTCUT_TYPES.MOVE_SHORTCUT_SUCCESS:
      return {
        ...state,
        list: removeFromState([action.payload], state.list)
      };

    case TYPES.CREATE_FILE_SUCCESS:
      return state;

    case TYPES.ADD_CREATED_FILE:
      return {
        ...state,
        list: [...state.list, action.payload]
      };

    case TYPES.CHANGE_FILE_VERSION_SUCCESS:
      return {
        ...state,
        list: state.list.map((item, index) => {
          if (item.id !== action.payload.params.id) {
            return item;
          }
          return {
            ...item,
            preview_url: item.preview_url ? item.preview_url + '?t=' + new Date().getTime() : null,
            updated_at: action.payload.data.updated_at,
            versions: item.versions
              ? [action.payload.data, ...item.versions]
              : [action.payload.data]
          };
        })
      };

    case TYPES.FETCH_FILE_VERSIONS_SUCCESS:
      return {
        ...state,
        list: state.list.map((item, index) =>
          item.id === action.payload.params.id
            ? {
                ...item,
                versions: action.payload.data
              }
            : item
        )
      };

    case TYPES.FETCH_FILE_ACTIVITY_SUCCESS:
      return {
        ...state,
        activity: action.payload.data
      };

    case TYPES.ADD_FILE_ACTIVITY:
      return {
        ...state,
        activity: action.activity
      };

    case TYPES.SET_KEEP_FOREVER_SUCCESS:
      return {
        state,
        list: state.list.map((item, index) =>
          item.id === action.payload.params.id
            ? {
                ...item,
                keep: action.payload.params.keep
              }
            : item
        )
      };

    case TYPES.EDIT_FILE_VERSION_SUCCESS:
      return {
        state,
        list: state.list.map((item, index) =>
          item.id === action.payload.params.fileId
            ? {
                ...item,
                versions: item.versions.map(version =>
                  version.id === action.payload.params.versionId
                    ? {
                        ...version,
                        ...action.payload.data
                      }
                    : version
                )
              }
            : item
        )
      };

    case TYPES.DELETE_FILE_VERSION_SUCCESS:
      return {
        state,
        list: state.list.map((item, index) =>
          item.id === action.payload.params.fileId
            ? {
                ...item,
                versions: item.versions.filter(
                  version => version.id !== action.payload.params.versionId
                )
              }
            : item
        )
      };

    case TYPES.SELECT_FILE:
      return {
        ...state,
        selected: bulkSelect(action.payload, state.list, state.selected)
      };

    case SHARES_TYPES.CREATE_SHARE_SUCCESS:
      if (action.payload.params.shareable_type === 'file') {
        return {
          ...state,
          list: updateOnShare(action.payload, state.list)
        };
      }
      return state;

    case SHARES_TYPES.CREATE_BULK_SHARE_SUCCESS:
      return {
        ...state,
        list: updateOnBulkShare(action.payload, state.list, 'file')
      };

    case SHARES_TYPES.DELETE_SHARE_SUCCESS:
      if (action.payload.data.shareable_type === 'file') {
        const array = state.list;

        return {
          ...state,
          list: updateOnUnshare(action.payload, array)
        };
      }
      return state;

    case SHARES_TYPES.UNSHARE_WITH_TEAM_SUCCESS:
      if (action.payload.params.shareable_type === 'file') {
        const array = state.list;

        return {
          ...state,
          list: updateOnUnshareWithEveryone(action.payload, array)
        };
      }
      return state;

    case LOCK_TYPES.LOCK_ITEM:
    case LOCK_TYPES.LOCK_ITEM_ERROR:
      if (action.payload.params.type === 'files') {
        return {
          ...state,
          list: state.list.map(x => {
            if (action.payload.params.id !== x.id) return x;

            return { ...x, is_locked: !x.is_locked };
          })
        };
      }
      return state;

    case LOCATION_CHANGE:
    case BULK_TYPES.CLEAR_SELECTED:
      return {
        ...state,
        selected: {
          start: null,
          list: []
        }
      };

    case BULK_TYPES.BULK_MOVE_SUCCESS:
    case BULK_TYPES.BULK_DELETE_SUCCESS:
      if (action.payload.files.length > 0 || action.payload.shortcuts.length > 0) {
        const moved_files = state.list.filter(
          f =>
            action.payload.files.indexOf(f.id) !== -1 ||
            action.payload.shortcuts.indexOf(f.shortcut_id) !== -1
        );

        return {
          ...state,
          list: state.list.filter(i => {
            const file = moved_files.find(f => f.id === i.id);
            if (!file) return true;
            return file.folder_id !== action.payload.folder_id || !action.payload.folder_id
              ? false
              : true;
          }),
          selected: {
            start: null,
            list: []
          }
        };
      }

      return state;

    case SHORTCUT_TYPES.DELETE_SHORTCUT_SUCCESS:
      if (action.payload.params.shareable_type === 'file') {
        return {
          ...state,
          list: state.list.filter(x => x.shortcut_id !== action.payload.params.shortcut_id)
        };
      }

    default:
      return state;
  }
}
