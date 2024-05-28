import store from 'utils/store';

export const removeFromState = (payload, state) => {
  let list = [...state];

  payload.forEach(p => {
    const current_item = list.find(x => x.id === p.item.id);

    if (current_item && (current_item.folder_id !== p.item.folder_id || !p.params.folder_id)) {
      list = list.filter(i => i.id !== p.item.id);
    }
  });

  return list;
};