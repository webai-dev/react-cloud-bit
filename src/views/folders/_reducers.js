import * as TYPES from './_types';
import * as SHARES_TYPES from 'views/shares/_types';
import * as BULK_TYPES from 'state/bulk/_types';
import * as SHORTCUT_TYPES from 'state/shortcuts/_types';
import { LOCATION_CHANGE } from 'react-router-redux';

import { moveFolder } from './_helpers';
import {
  bulkSelect,
  updateOnShare,
  updateOnBulkShare,
  updateOnUnshare,
  updateOnUnshareWithEveryone
} from 'state/bulk/_helpers';

import _orderBy from 'lodash/orderBy';

const folderRegex = /folder\/(\d+).*/;
const initFolder = window.location.pathname.match(folderRegex);
export const INITIAL_STATE = {
  active: initFolder && initFolder[1] ? parseInt(initFolder[1]) : null,
  list: [],
  click_active: { current: {}, last: {}, position: { top: 0, left: 0 } },
  collapsed: {},
  selected: {
    start: null,
    list: []
  },
  activity: [],
  rootOpen: true,
  loading: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOCATION_CHANGE: // Update active folder on location change
      const folder_path = action.payload.pathname.match(folderRegex);

      if (folder_path && folder_path[1]) {
        return { ...state, active: parseInt(folder_path[1]) };
      }

      return {
        ...state,
        active: null,
        selected: {
          start: null,
          list: []
        }
      };

    case TYPES.SET_CLICK_ACTIVE_FOLDER:
      return { ...state, click_active: action.payload };

    case TYPES.COLLAPSE_ROOT_FOLDER:
      return { ...state, rootOpen: !state.rootOpen };

    case TYPES.SET_LOADING_STATUS:
      return { ...state, loading: action.payload };

    case TYPES.SET_COLLAPSE_FOLDER:
      let collapsed = Object.assign({}, state.collapsed);

      if (collapsed[action.payload] === undefined) {
        collapsed[action.payload] = true;
      } else {
        collapsed[action.payload] = !collapsed[action.payload];
      }

      return { ...state, collapsed };

    case TYPES.RENAME_FOLDER_SUCCESS:
      return {
        ...state,
        list: state.list.map((item, index) => {
          if (item.id !== action.payload.params.id) {
            return item;
          }

          return {
            ...item,
            title: action.payload.folder.title,
            updated_at: action.payload.folder.updated_at
          };
        })
      };

    case TYPES.FETCH_FOLDER_INDEX_SUCCESS:
      const { parent, folders, path } = action.payload.data;
      let updated_list = [...state.list];
      let current_folder = { ...parent };
      let new_data = [...folders, ...path];

      if (current_folder && Object.keys(current_folder).length > 0) {
        delete current_folder.folder;

        if (!updated_list.find(f => f.id === current_folder.id)) {
          updated_list.push(current_folder);
        }
      }

      const new_folders = new_data.filter(f => updated_list.findIndex(l => l.id === f.id) === -1);
      const existing_folders = new_data.filter(
        f => updated_list.findIndex(l => l.id === f.id) !== -1 && Object.keys(f).length > 5
      );

      updated_list = [...updated_list, ...new_folders];
      updated_list = updated_list.map(f => {
        const update_old_folder = existing_folders.find(x => x.id === f.id);
        const folder = { ...f };
        const in_path = path.find(p => p.id === folder.id);

        if (in_path) {
          folder.in_shared = in_path.in_shared;
        }

        if (action.payload.params.root_folders && !folder.folder_id) {
          // Mark folder tree root folders
          folder.root = true;
        }

        if (update_old_folder) {
          return { ...folder, ...update_old_folder };
        } else if (current_folder && current_folder.id === f.id) {
          return { ...folder, ...current_folder };
        } else {
          return folder;
        }
      });

      return {
        ...state,
        list: _orderBy(updated_list, ['folder_id'], ['asc'])
      };

    case TYPES.CREATE_FOLDER_SUCCESS:
    case SHORTCUT_TYPES.CREATE_SHORTCUT_SUCCESS:
      let new_folder = action.payload.folder ? action.payload.folder : action.payload.params.folder;

      if (new_folder) {
        if (!action.payload.params.folder_id || action.payload.params.folder_id === undefined) {
          new_folder.folder_id = null;
          new_folder.root = true;
        }

        if (!new_folder.shares_count) {
          new_folder.shares_count = 0;
        }

        if (action.payload.params.is_shortcut) {
          new_folder.is_shortcut = true;
          new_folder.folder_id = action.payload.data.folder_id;
          new_folder.shortcut_id = action.payload.data.id;

          if (state.list.findIndex(f => f.id === new_folder.id) !== -1) {
            return {
              ...state,
              list: state.list.map(x => {
                if (new_folder.id !== x.id) return x;
                else return new_folder;
              })
            };
          }
        }

        return {
          ...state,
          list: [...state.list, new_folder]
        };
      }

      return state;

    case TYPES.DELETE_FOLDER_SUCCESS:
    case SHORTCUT_TYPES.DELETE_SHORTCUT_SUCCESS:
      return {
        ...state,
        list: state.list.filter(x => {
          return x.id !== action.payload.params.id;
        })
      };

      return state;

    case TYPES.MOVE_FOLDER_SUCCESS:
    case SHORTCUT_TYPES.MOVE_SHORTCUT_SUCCESS:
      return {
        ...state,
        list: moveFolder([action.payload], state.list),
        click_active: {
          ...state.click_active,
          current: {
            ...state.click_active.current,
            folder_id: action.payload.folder ? action.payload.folder.folder_id : null
          },
          last: {
            ...state.click_active.last,
            folder_id: action.payload.folder ? action.payload.folder.folder_id : null
          }
        }
      };

    case TYPES.SELECT_FOLDER:
      const selected_folders = state.active
        ? state.list.filter(f => f.folder_id === state.active)
        : state.list.filter(f => f.folder_id === null);

      return {
        ...state,
        selected: bulkSelect(action.payload, selected_folders, state.selected)
      };

    case BULK_TYPES.CLEAR_SELECTED:
      return {
        ...state,
        selected: {
          start: null,
          list: []
        }
      };

    case BULK_TYPES.BULK_MOVE_SUCCESS:
      if (action.payload.folders.length > 0 || action.payload.shortcuts.length > 0) {
        const moved_folders = state.list.filter(
          f =>
            action.payload.folders.indexOf(f.id) !== -1 ||
            action.payload.shortcuts.indexOf(f.shortcut_id) !== -1
        );

        const payload = moved_folders.map(m => {
          return {
            folder: { ...m, folder_id: action.payload.folder_id },
            params: {
              folder_id:
                action.payload.folder_id && action.payload.folder_id !== undefined
                  ? action.payload.folder_id
                  : null
            }
          };
        });

        return {
          ...state,
          list: moveFolder(payload, state.list),
          selected: {
            start: null,
            list: []
          }
        };
      }

      return state;

    case BULK_TYPES.BULK_DELETE_SUCCESS:
      if (action.payload.folders.length > 0 || action.payload.shortcuts.length > 0) {
        const moved_folders = state.list.filter(
          f =>
            action.payload.folders.indexOf(f.id) !== -1 ||
            action.payload.shortcuts.indexOf(f.shortcut_id) !== -1
        );

        return {
          ...state,
          list: state.list.filter(i => {
            const folder = moved_folders.find(f => f.id === i.id);
            if (!folder) return true;
            return folder.folder_id !== action.payload.folder_id || !action.payload.folder_id
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

    case SHARES_TYPES.CREATE_SHARE_SUCCESS:
      if (action.payload.data.shareable_type === 'folder' || !action.payload.data.shareable_type) {
        const array = state.list;

        return {
          ...state,
          list: updateOnShare(action.payload, array)
        };
      }
      return state;
    case SHARES_TYPES.DELETE_SHARE_SUCCESS:
      if (action.payload.data.shareable_type === 'folder') {
        const array = state.list;

        return {
          ...state,
          list: updateOnUnshare(action.payload, array)
        };
      }
      return state;
    case SHARES_TYPES.UNSHARE_WITH_TEAM_SUCCESS:
      if (
        action.payload.params.shareable_type === 'folder' || // Create share
        action.payload.data.shareable_type === 'folder' // Delete share
      ) {
        return { ...state, list: updateOnUnshareWithEveryone(action.payload, state.list) };
      }

      return state;

    case SHARES_TYPES.CREATE_BULK_SHARE_SUCCESS:
      return {
        ...state,
        list: updateOnBulkShare(action.payload, state.list, 'folder')
      };

    case SHARES_TYPES.BULK_REMOVE_FROM_SHARED_SUCCESS:
      return {
        ...state,
        list: state.list.filter(x => {
          return !x.share_id || action.payload.shares.indexOf(x.share_id) === -1;
        })
      };

    case TYPES.FETCH_FOLDER_ACTIVITY_SUCCESS:
      return {
        ...state,
        activity: action.payload.data
      };

    case TYPES.ADD_FOLDER_ACTIVITY:
      return {
        ...state,
        activity: action.activity
      };

    default:
      return state;
  }
}
