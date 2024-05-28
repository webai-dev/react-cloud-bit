import { mock } from 'utils/api';
import { default as mockStore } from 'utils/store';

import * as TYPES from '../_types';
import { favouritePin } from '../_actions';
import pinboard from '../_reducers';

describe('favouritePin action', () => {
  const initialState = {
    pins: [{ id: 1, favourite: 0 }, { id: 2, favourite: 1 }],
    favourite_count: 1,
    showFavorites: false
  };

  let store;
  const id = 1;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('favourites a pin', async () => {
    // given
    mock.onPut(`pins/${id}/favourite`).reply(200, {
      status: 'success'
    });

    // when
    await favouritePin({ id })(store.dispatch);

    // then
    expect(store.getActions()).toEqual([
      { type: TYPES.FAVOURITE_PIN },
      { type: TYPES.FAVOURITE_PIN_SUCCESS, payload: id }
    ]);
  });

  it('modifies pins favourite state', () => {
    expect(pinboard(initialState, { type: TYPES.FAVOURITE_PIN_SUCCESS, payload: 1 })).toEqual({
      pins: [{ id: 1, favourite: 1 }, { id: 2, favourite: 1 }],
      favourite_count: 2,
      showFavorites: initialState.showFavorites
    });
  });
});
