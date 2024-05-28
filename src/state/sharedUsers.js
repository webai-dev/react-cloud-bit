export const selectSharedCount = (state, type, id) => {
  // find the shared item
  let item = state[type + 's'].list.find(item => item.id === id);

  if (!item) {
    item = state.shares[type + 's'].find(item => item.id === id);
  }
  // if not found return (this should never happen)
  if (!item) {
    return { count: 1, hasIndividualShares: false };
  }

  //bool showing if the item has shares of its own
  const hasIndividualShares =
    (item.shares && item.shares.length > 0) || (item.shared_with && item.shared_with.length > 0);

  // accepts an item
  // returns its parent folder or null if there is no parent or the item is a shotcut
  const findParentFolder = item =>
    item.folder_id && !item.shortcut_id
      ? state.folders.list.find(folder => folder.id === item.folder_id)
      : null;

  // traverses recursivly the folder tree and keeps a list of every user the item is shared with
  const owner = item.user_id;
  let shares = [];
  while (item) {
    if (item.shares)
      item.shares.forEach(
        s => !shares.includes(s.user_id) && s.user_id !== owner && shares.push(s.user_id)
      );
    else if (item.shared_with)
      item.shared_with.forEach(
        user_id => !shares.includes(user_id) && user_id !== owner && shares.push(user_id)
      );

    item = findParentFolder(item);
  }

  return {
    // + 1 for the owner
    count: shares.length + 1,
    hasIndividualShares
  };
};
