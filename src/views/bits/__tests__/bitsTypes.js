import { mock } from 'utils/api';
import { default as mockStore } from 'utils/store';
import { fetchBitTypes } from 'views/bits/_actions';
import * as TYPES from 'views/bits/_types';
import bits from '../_reducers';

// import initialState from 'utils/store/tests/bits';
describe('Bits Types action', () => {
  let store;

  const initialState = {
    types: []
  };

  const response = [];

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('fetch bits action ', async () => {
    // given
    mock.onGet(`bits/types`).reply(200, response);

    // when
    await fetchBitTypes({})(store.dispatch);

    // then
    expect(store.getActions()).toEqual([
      { type: TYPES.FETCH_BIT_TYPES },
      {
        type: TYPES.FETCH_BIT_TYPES_SUCCESS,
        payload: []
      }
    ]);
  });

  it('should return bit types new refactored array', () => {
    expect(
      bits(initialState, {
        type: TYPES.FETCH_BIT_TYPES_SUCCESS,
        payload: [
          {
            id: 3,
            name: 'Note'
          }
        ]
      })
    ).toEqual({ types: [{ label: 'Note', value: 3 }] });
  });
});
