import * as TYPES from './_types';

const INITIAL_STATE = {
  status: '',
  uploading: [],
  totals: 0
};

let uploading = [];

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.SET_UPLOADING_STATUS:
      return {
        ...state,
        status: action.payload
      };

    case TYPES.SET_UPLOADING_DATA:
      uploading = [];

      if (action.payload.uploading) {
        if (action.payload.uploading !== 0) {
          const fileIndex = state.uploading.findIndex(x => x.id === action.payload.uploading.id);

          if (fileIndex !== -1) {
            uploading = state.uploading.map((x, index) => {
              if (index !== fileIndex) return x;

              return { ...x, status: action.payload.uploading.status };
            });
          } else {
            uploading = [action.payload.uploading, ...state.uploading];
          }
        }
      } else {
        uploading = state.uploading;
      }

      if (action.payload.uploading === 0) {
        uploading = [];
      }

      return {
        ...state,
        totals: action.payload.totals
          ? action.payload.totals
          : action.payload.totals === 0 ? 0 : state.totals,
        uploading: uploading
      };

    default:
      return state;
  }
}
