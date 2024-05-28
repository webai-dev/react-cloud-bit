import * as TYPES from './_types';

export function setUploadingStatus(status) {
  return dispatch => {
    dispatch({ type: TYPES.SET_UPLOADING_STATUS, payload: status });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}

export function setUploadingData(data) {
  return dispatch => {
    dispatch({ type: TYPES.SET_UPLOADING_DATA, payload: data });

    return new Promise(function(resolve, reject) {
      resolve('Success!');
    });
  };
}
