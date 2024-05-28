import store from 'utils/store';
import _orderBy from 'lodash/orderBy';
import _get from 'lodash/get';

export const bulkSelect = (payload, array, selected) => {
  let start_index = -1;
  let end_index = -1;
  let data = _orderBy([...array], [s => s.title.toLowerCase()], ['asc']);
  let newSelected = [];

  const id = payload.folder_id
    ? payload.folder_id
    : payload.file_id
    ? payload.file_id
    : payload.bit_id
    ? payload.bit_id
    : null;

  if (payload.shiftKey) {
    // Shift key is pressed

    if (selected.start !== null) {
      start_index = data.findIndex(f => f.id === selected.start);
      end_index = data.findIndex(f => f.id === id);

      if (start_index !== end_index) {
        newSelected = data.filter((f, i) => {
          if (start_index < end_index) return i >= start_index && i <= end_index;
          else if (start_index > end_index) return i >= end_index && i <= start_index;
        });

        return {
          ...selected,
          list: newSelected.map(f => f.id)
        };
      } else {
        return {
          ...selected,
          list: [id]
        };
      }
    } else {
      return {
        start: id,
        list: [id]
      };
    }
  } else if (payload.ctrlKey) {
    // Control key is pressed
    return {
      start: selected.start === null ? id : selected.start,
      list:
        selected.list.indexOf(id) !== -1
          ? selected.list.filter(f => f !== id)
          : [...selected.list, id]
    };
  } else if (payload.multiple) {
    // multiple select/diselect
    if (selected.list.length === data.length) {
      return {
        start: null,
        list: []
      };
    }

    return {
      ...selected,
      list: data.map(f => f.id)
    };
  } else {
    // Single select
    if (payload.folder_id) {
      return {
        start: payload.folder_id,
        list:
          selected.list.indexOf(id) !== -1
            ? selected.list.filter(f => f !== id)
            : [...selected.list, id]
      };
    } else {
      return {
        start: selected.start === null ? id : selected.start,
        list:
          selected.list.indexOf(id) !== -1
            ? selected.list.filter(f => f !== id)
            : [...selected.list, id]
      };
    }
  }
};

export const updateOnShare = (payload, state) => {
  let list = [...state];

  list = list.map((item, index) => {
    if (item.id !== payload.params.shareable_id) {
      return item;
    }

    return {
      ...item,
      is_shared: true,
      shares: payload.data.shares
    };
  });

  return list;
};

export const updateOnBulkShare = (payload, list, type) => {
  return list.map(item => {
    const additionalShares = payload.data.data.filter(
      share => item.id === share.shareable_id && type === share.shareable_type
    );

    return {
      ...item,
      is_shared: additionalShares.length > 0 ? true : item.is_shared,
      shares: [...(item.shares || []), ...additionalShares]
    };
  });
};

export const updateOnUnshare = (payload, list) => {
  if (payload.data.user_id === payload.params.user_id) {
    // current user
    return list.filter((item, index) => {
      return item.id !== payload.data.shareable_id;
    });
  } else {
    return list.map((item, index) => {
      if (payload.data.shareable_id === item.id) {
        const newShares = item.shares.filter(share => share.user_id !== payload.data.user_id);
        return {
          ...item,
          is_shared: newShares.length > 0,
          shares: newShares
        };
      } else return item;
    });
  }
};

export const updateOnUnshareWithEveryone = (payload, list) => {
  return (
    list &&
    list.map((item, index) => {
      if (payload.params.shareable_id === item.id) {
        return {
          ...item,
          shares: []
        };
      } else return item;
    })
  );
};

export const getSelectedItems = state => {
  const location = window.location.pathname;
  let selected_bits = [];
  let selected_files = [];
  let selected_folders = [];
  let selected_shortcuts = [];

  if (state.folders.active) {
    selected_bits = _get(state, 'bits.selected.list', []);
    selected_files = _get(state, 'files.selected.list', []);
    selected_folders = _get(state, 'folders.selected.list', []);
  } else if (location === '/shared') {
    selected_bits = _get(state, 'shares.selected.bits.list', []);
    selected_files = _get(state, 'shares.selected.files.list', []);
    selected_folders = _get(state, 'shares.selected.folders.list', []);
  } else if (location === '/dashboard') {
  } else {
    // root
    selected_folders = _get(state, 'folders.selected.list', []);
  }

  return {
    selected_bits,
    selected_files,
    selected_folders,
    selected_shortcuts
  };
};

export const setSelectedItemsParams = selected => {
  const state = store.getState();
  const location = window.location.pathname;
  let params = { bits: [], files: [], folders: [], shortcuts: [] };

  let folders = [],
    files = [],
    bits = [],
    shares = [];

  if (state.folders.active || location === '/') {
    bits = _get(state, 'bits.list', []);
    files = _get(state, 'files.list', []);
    folders = _get(state, 'folders.list', []);
  } else if (location === '/shared') {
    bits = _get(state, 'shares.bits', []);
    files = _get(state, 'shares.files', []);
    folders = _get(state, 'shares.folders', []);

    shares = [
      ...bits.filter(i => i.shares && selected.bits.indexOf(i.id) !== -1).map(i => i.share.id),
      ...files.filter(i => i.shares && selected.files.indexOf(i.id) !== -1).map(i => i.share.id),
      ...folders.filter(i => i.shares && selected.folders.indexOf(i.id) !== -1).map(i => i.share.id)
    ];

    params.shares = shares;
  }

  params.shortcuts = [
    ...bits.filter(b => b.is_shortcut && selected.bits.indexOf(b.id) !== -1),
    ...files.filter(f => f.is_shortcut && selected.files.indexOf(f.id) !== -1),
    ...folders.filter(f => f.is_shortcut && selected.folders.indexOf(f.id) !== -1)
  ];

  Object.keys(selected).forEach(key => {
    params[key] = selected[key].filter(f => params.shortcuts.findIndex(s => s.id === f) === -1);
  });

  params.shortcuts = params.shortcuts.map(s => s.shortcut_id);

  return params;
};
