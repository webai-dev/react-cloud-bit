import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { mock } from 'utils/api';
import { default as mockStore } from 'utils/store';
import defaults from 'utils/store/tests';

import create from 'utils/api/tests/folders/_create';

import * as TYPES from '../_types';
import folders from '../_reducers';
import { INITIAL_STATE } from '../_reducers';
import { createFolder } from '../_actions';

import FolderTree from '../FolderTree';

describe('Creating', () => {
  let store = mockStore(defaults);

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

  it('creates CREATE_FOLDER_SUCCESS action', async () => {
    let params = { team_id: 1, title: 'My photos' };

    mock.onPost(`folders`).reply(200, create);
    const res = await createFolder(params)(store.dispatch);
    const payload = { folder: res, params: params };

    const expectedActions = [
      { type: TYPES.CREATE_FOLDER },
      {
        type: TYPES.CREATE_FOLDER_SUCCESS,
        payload
      }
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('adds new folder to ROOT', () => {
    let params = { team_id: 1, title: 'My photos' };
    const payload = { folder: create, params: params };

    const newState = folders(store.getState().folders, {
      type: TYPES.CREATE_FOLDER_SUCCESS,
      payload
    });

    store = mockStore({ ...defaults, folders: newState });
    const { folderTreeWrapper } = setup();
    const folderSelector = folderTreeWrapper.find('li[data-id=' + payload.folder.id + ']');
    const root_folders = store.getState().folders.list.filter(f => f.root);

    expect(newState.list).toEqual(expect.arrayContaining([payload.folder]));
    expect(folderTreeWrapper.find('.folder-tree').children().length).toBe(root_folders.length);
    expect(folderSelector.length).toBe(1);
    expect(folderSelector.parent('.folder-tree').length).toBe(1);
  });

  it('adds new folder inside an existing folder', () => {
    let params = { team_id: 1, title: 'My camera', folder_id: 936 };
    const payload = {
      folder: { ...create, id: 937, title: params.title, folder_id: params.folder_id },
      params: params
    };

    const newState = folders(store.getState().folders, {
      type: TYPES.CREATE_FOLDER_SUCCESS,
      payload
    });
    store = mockStore({
      ...defaults,
      folders: { ...newState, collapsed: { [params.folder_id]: true } }
    });

    const { folderTreeWrapper } = setup();
    const parentSelector = folderTreeWrapper.find('li[data-id=' + params.folder_id + ']');

    expect(newState.list).toEqual(expect.arrayContaining([payload.folder]));
    expect(
      parentSelector.find('.child-wrap').find('li[data-id=' + payload.folder.id + ']').length
    ).toBe(1);
  });
});
