const initialState = {
  filters: {
    sortBy: 'alphabetical_ascending',
    order: {
      bits: 0,
      folders: 1,
      files: 2
    },
    collapse: {
      bits: false,
      folders: false,
      files: false
    },
    fillGaps: false
  }
};

export default initialState;
