import orderBy from 'lodash/orderBy';

import * as TYPES from './_types';
import * as SHARES_TYPES from 'views/shares/_types';
import * as LOCK_TYPES from 'views/dashboard/_types';
import * as BULK_TYPES from 'state/bulk/_types';
import * as SHORTCUT_TYPES from 'state/shortcuts/_types';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  bulkSelect,
  updateOnShare,
  updateOnBulkShare,
  updateOnUnshare,
  updateOnUnshareWithEveryone
} from 'state/bulk/_helpers';
import { removeFromState } from 'utils/state';

const INITIAL_STATE = {
  types: [],
  list: [],
  selected: {
    start: null,
    list: []
  },
  activity: []
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_BIT_TYPES:
    case TYPES.FETCH_BIT_TYPES_ERROR:
      return state;
    case TYPES.FETCH_BIT_TYPES_SUCCESS:
      const payload = action.payload.map(x => {
        return { value: x.id, label: x.name, ...x };
      });
      return { ...state, types: orderBy(payload, ['label'], ['asc']) };

    case TYPES.TOGGLE_BIT_TYPE:
    case TYPES.TOGGLE_BIT_TYPE_ERROR:
      return {
        ...state,
        types: state.types.map(t => {
          if (t.id !== action.payload.id) return t;

          return {
            ...t,
            pivot: {
              ...t.pivot,
              enabled: !t.pivot.enabled
            }
          };
        })
      };

    case TYPES.CREATE_BIT_SUCCESS:
      if (action.payload.inActiveFolder) {
        return {
          ...state,
          list: [
            ...state.list,
            {
              ...action.payload.data,
              type: state.types.find(type => type.id === action.payload.data.type_id)
            }
          ]
        };
      } else return state;

    case TYPES.FETCH_BIT_SUCCESS:
      if (!action.payload.token)
        return {
          ...state,
          list: [action.payload]
        };
      else return state;

    case TYPES.FETCH_FOLDER_BITS:
    case TYPES.FETCH_FOLDER_BITS_ERROR:
      return { ...state, list: [] };
    case TYPES.FETCH_FOLDER_BITS_SUCCESS:
      return { ...state, list: action.payload };

    case TYPES.MOVE_BIT_SUCCESS:
    case TYPES.DELETE_BIT_SUCCESS:
    case SHORTCUT_TYPES.MOVE_SHORTCUT_SUCCESS:
      return {
        ...state,
        list: removeFromState([action.payload], state.list)
      };

    case TYPES.SELECT_BIT:
      return {
        ...state,
        selected: bulkSelect(action.payload, state.list, state.selected)
      };

    case TYPES.EDIT_BIT_SUCCESS:
      return {
        ...state,
        list: state.list.map((item, index) => {
          if (item.id !== action.payload.params.id) {
            return item;
          }

          return {
            ...item,
            ...action.payload.bit
          };
        })
      };

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
      if (action.payload.bits.length > 0 || action.payload.shortcuts.length > 0) {
        const moved_bits = state.list.filter(
          f =>
            action.payload.bits.indexOf(f.id) !== -1 ||
            action.payload.shortcuts.indexOf(f.shortcut_id) !== -1
        );

        return {
          ...state,
          list: state.list.filter(i => {
            const bit = moved_bits.find(f => f.id === i.id);
            if (!bit) return true;
            return bit.folder_id !== action.payload.folder_id || !action.payload.folder_id
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
      if (action.payload.params.shareable_type === 'bit') {
        return {
          ...state,
          list: updateOnShare(action.payload, state.list)
        };
      }
      return state;

    case SHARES_TYPES.CREATE_BULK_SHARE_SUCCESS:
      return {
        ...state,
        list: updateOnBulkShare(action.payload, state.list, 'bit')
      };

    case SHARES_TYPES.DELETE_SHARE_SUCCESS:
      if (action.payload.data.shareable_type === 'bit') {
        const array = state.list;

        return {
          ...state,
          list: updateOnUnshare(action.payload, array)
        };
      }
      return state;

    case SHARES_TYPES.UNSHARE_WITH_TEAM_SUCCESS:
      if (action.payload.params.shareable_type === 'bit') {
        const array = state.list;

        return {
          ...state,
          list: updateOnUnshareWithEveryone(action.payload, array)
        };
      }
      return state;

    case LOCK_TYPES.LOCK_ITEM:
    case LOCK_TYPES.LOCK_ITEM_ERROR:
      if (action.payload.params.type === 'bits') {
        return {
          ...state,
          list: state.list.map(x => {
            if (action.payload.params.id !== x.id) return x;

            return { ...x, is_locked: !x.is_locked };
          })
        };
      }
      return state;

    case SHORTCUT_TYPES.DELETE_SHORTCUT_SUCCESS:
      if (action.payload.params.shareable_type === 'bit') {
        return {
          ...state,
          list: state.list.filter(x => x.shortcut_id !== action.payload.params.shortcut_id)
        };
      }

    case TYPES.FETCH_BIT_ACTIVITY_SUCCESS:
      return {
        ...state,
        activity: action.payload.data
      };
    case TYPES.ADD_BIT_ACTIVITY:
      return {
        ...state,
        activity: action.activity
      };
    default:
      return state;
  }
}
