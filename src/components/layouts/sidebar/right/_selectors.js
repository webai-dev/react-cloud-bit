export const isDetailsTabOpen = state => {
  return state.sidebar.show && state.sidebar.activeTab === 'file_details';
};

export const getTabsDetails = state => {
  if (state.sidebar.mode === 'file') {
    const searchFiles = state.search.index ? state.search.index.files : [];
    const dashboardFiles = state.dashboard ? state.dashboard.files : [];
    const file = [
      ...state.files.list,
      ...state.shares.files,
      ...searchFiles,
      ...dashboardFiles
    ].find(file => file.id === state.sidebar.data.fileId);
    return file;
  } else if (state.sidebar.mode === 'folder') {
    const folders = state.folders ? state.folders : [];
    const folder = [...state.folders.list, ...state.shares.folders, ...folders].find(
      folder => folder.id === state.sidebar.data.fileId
    );
    return folder;
  } else {
    const dashboardBits = state.dashboard ? state.dashboard.bits : [];
    const bit = [...state.bits.list, ...state.shares.bits, ...dashboardBits].find(
      bit => bit.id === state.sidebar.data.fileId
    );
    return bit;
  }
};
