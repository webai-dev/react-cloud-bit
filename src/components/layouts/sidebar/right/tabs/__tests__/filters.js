import { mock } from 'utils/api';
import { default as mockStore } from 'utils/store';
import {
  filtersSortChange,
  filtersOrderChange,
  filtersCollapseChange,
  filtersExpandCollapse,
  filtersFillGaps,
  fetchFolderFilters
} from 'state/filters/_actions';
import filtersReducer from 'state/filters/_reducers';
import initialState from 'utils/store/tests/filters';
import * as TYPES from 'state/filters/_types';

describe('Change folder filters', () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it('changes the sorting order', () => {
    const action = filtersSortChange('recently_edited');
    const newState = filtersReducer(initialState.filters, action);

    expect(newState.sortBy).toEqual('recently_edited');
  });

  it('changes the items order', () => {
    const newOrder = {
      bits: 2,
      folders: 1,
      files: 0
    };

    const action = filtersOrderChange(newOrder);
    const newState = filtersReducer(initialState.filters, action);

    expect(newState.order).toEqual(newOrder);
  });

  it('collapses the folders section', () => {
    const newCollapse = {
      bits: false,
      folders: true,
      files: false
    };

    const action = filtersCollapseChange(newCollapse);
    const newState = filtersReducer(initialState.filters, action);

    expect(newState.collapse).toEqual(newCollapse);
  });

  describe('when all folders section is collapsed', () => {
    const state = {
      filters: {
        ...initialState.filters,
        collapse: {
          bits: false,
          folders: true,
          files: false
        }
      }
    };

    it('expands the folders section', () => {
      const action = filtersExpandCollapse('folders');
      const expandedState = filtersReducer(state, action);

      expect(expandedState.collapse).toEqual(initialState.collapse);
    });
  });

  it('changes the fill gaps option', () => {
    const action = filtersFillGaps(true);
    const newState = filtersReducer(initialState.filters, action);

    expect(newState.fillGaps).toEqual(true);
  });

  describe('when requesting a folders filters', () => {
    let params = {
      folder_id: 10,
      is_shares: false,
      team_id: 1
    };

    const response = {
      sort_by: 'recently_edited',
      bits_order: 0,
      folders_order: 2,
      files_order: 1,
      bits_collapse: true,
      folders_collapse: false,
      files_collapse: true,
      fill_gaps: false
    };

    it('emits the correct actions', async () => {
      mock.onGet('filters', { params }).reply(200, response);

      await fetchFolderFilters(params)(store.dispatch);

      expect(store.getActions()).toEqual([
        { type: TYPES.FETCH_FILTERS },
        {
          type: TYPES.FETCH_FILTERS_SUCCESS,
          payload: response
        }
      ]);
    });

    it('updates the store correctly', async () => {
      const action = {
        type: TYPES.FETCH_FILTERS_SUCCESS,
        payload: response
      };

      const newState = filtersReducer(initialState.filters, action);

      expect(newState).toEqual({
        sortBy: 'recently_edited',
        order: {
          bits: 0,
          folders: 2,
          files: 1
        },
        collapse: {
          bits: true,
          folders: false,
          files: true
        },
        fillGaps: false
      });
    });
  });
});
