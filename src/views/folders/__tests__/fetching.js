import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import _uniqBy from 'lodash/uniqBy';
import _differenceBy from 'lodash/differenceBy';

import { mock } from 'utils/api';
import { default as mockStore } from 'utils/store';
import defaults from 'utils/store/tests';

import level_0 from 'utils/api/tests/folders/_index_level_0';
import level_1 from 'utils/api/tests/folders/_index_level_1';
import level_2 from 'utils/api/tests/folders/_index_level_2';

import * as TYPES from '../_types';
import folders from '../_reducers';
import { INITIAL_STATE } from '../_reducers';
import { fetchFolders, setCollapseFolder } from '../_actions';

import FolderTree from '../FolderTree';

describe('Fetching', () => {
  let store = mockStore({
    ...defaults,
    folders: INITIAL_STATE
  });

  const isPayloadInState = (payload, list) => {
    const data = _uniqBy([...payload.data.folders, ...payload.data.path], 'id');
    const pass = _differenceBy(data, list, 'id');

    return pass.length === 0;
  };

  const setup = () => {
    const props = {
      active: null,
      rootActive: false,
      rootOpen: true,
      rightClick: true
    };

    const folderTreeWrapper = mount(
      <Provider store={store}>
        <FolderTree {...props} />
      </Provider>
    );

    return {
      props,
      folderTreeWrapper
    };
  };

  beforeEach(() => {
    store.clearActions();
  });

  afterEach(() => {
    mock.reset();
    mock.restore();
  });

  it('creates FETCH_FOLDER_INDEX action', async () => {
    let params = { team_id: 1, folder_id: null, root_folders: true }; // Top level (root) folders

    mock.onGet(`folders`).reply(200, level_0);
    const res = await fetchFolders(params)(store.dispatch);
    const payload = { data: res, folder_id: params.folder_id, params };

    const expectedActions = [
      { type: TYPES.FETCH_FOLDER_INDEX },
      {
        type: TYPES.FETCH_FOLDER_INDEX_SUCCESS,
        payload
      }
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates SET_COLLAPSE_FOLDER action', async () => {
    let params = 481; // Top level (root) folders

    await setCollapseFolder(params)(store.dispatch);
    const payload = params;

    const expectedActions = [
      {
        type: TYPES.SET_COLLAPSE_FOLDER,
        payload
      }
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('creates ROOT folders tree', () => {
    const payload = { data: level_0, folder_id: null, params: { root_folders: true } };

    const newState = folders(store.getState().folders, {
      type: TYPES.FETCH_FOLDER_INDEX_SUCCESS,
      payload
    });

    store = mockStore({ ...defaults, folders: newState });
    const { folderTreeWrapper } = setup();
    const root_folders = store.getState().folders.list.filter(f => f.root);

    expect(true).toEqual(isPayloadInState(payload, newState.list));
    expect(folderTreeWrapper.find('ul').hasClass('folder-tree')).toBe(true);
    expect(folderTreeWrapper.find('.folder-tree').children().length).toBe(root_folders.length);
  });

  it('opens a ROOT folder with children - 1st Level', () => {
    const payload = { data: level_1, folder_id: 482, params: {} };

    let newState = folders(store.getState().folders, {
      type: TYPES.SET_COLLAPSE_FOLDER,
      payload: payload.folder_id
    });

    newState = folders(newState, {
      type: TYPES.FETCH_FOLDER_INDEX_SUCCESS,
      payload
    });

    store = mockStore({ ...defaults, folders: newState });
    const { folderTreeWrapper } = setup();
    const parentSelector = folderTreeWrapper
      .find('.folder-tree')
      .find('li[data-id=' + payload.folder_id + ']')
      .find('.child-wrap');

    expect(true).toEqual(isPayloadInState(payload, newState.list));
    expect(parentSelector.length).toBe(1);
    expect(parentSelector.find('li').length).toBe(payload.data.folders.length);
  });

  it('opens a 1st Level folder with children - 2nd Level', () => {
    const payload = { data: level_2, folder_id: 481, params: {} };

    let newState = folders(store.getState().folders, {
      type: TYPES.SET_COLLAPSE_FOLDER,
      payload: payload.folder_id
    });

    newState = folders(newState, {
      type: TYPES.FETCH_FOLDER_INDEX_SUCCESS,
      payload
    });

    store = mockStore({ ...defaults, folders: newState });
    const { folderTreeWrapper } = setup();
    const parentSelector = folderTreeWrapper
      .find('.folder-tree')
      .find('li[data-id=' + payload.folder_id + ']')
      .find('.child-wrap');

    expect(true).toEqual(isPayloadInState(payload, newState.list));
    expect(parentSelector.length).toBe(1);
    expect(parentSelector.find('li').length).toBe(payload.data.folders.length);
  });
});
