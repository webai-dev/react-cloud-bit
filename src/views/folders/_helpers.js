import * as SHARES_TYPES from 'views/shares/_types';

export const moveFolder = (payload, folders) => {
  let list = [...folders];

  payload.forEach(p => {
    const id = p.folder ? p.folder.id : p.item ? p.item.id : null;

    list = list.map(f => {
      if (f.id !== id) return f;

      let new_folder = {
        ...f,
        folder_id: p.params.folder_id ? p.params.folder_id : null
      };

      if (!p.params.folder_id || p.params.folder_id === undefined) new_folder.root = true;
      else delete new_folder.root;

      return new_folder;
    });
  });

  return list;
};

export const getFolderFullPath = (folder, state) => {
  let path = [];
  let current_folder_id = folder ? folder.folder_id : null;

  while (current_folder_id) {
    const fol = state.folders.list.find(f => f.id === current_folder_id);

    if (fol) {
      path.unshift({ id: fol.id, title: fol.title });
      current_folder_id = fol.folder_id;
    } else {
      current_folder_id = null;
    }
  }

  return path;
};
