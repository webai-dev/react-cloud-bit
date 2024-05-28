import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';

import { mock } from 'utils/api';
import { default as mockStore } from 'utils/store';
import defaults from 'utils/store/tests';

import move from 'utils/api/tests/folders/_move';

import * as TYPES from '../_types';
import folders from '../_reducers';
import { INITIAL_STATE } from '../_reducers';
import { moveFolder } from '../_actions';

import FolderTree from '../FolderTree';

describe('Moving', () => {
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

  it('creates MOVE_FOLDER_SUCCESS action', async () => {
    let params = {
      folder_id: 482,
      id: 737,
      old_folder_id: 736,
      team_id: 1
    };

    mock.onPut(`folders/${params.id}/move`).reply(200, move);
    const res = await moveFolder(params)(store.dispatch);
    const payload = { params: params, folder: res.item, path: res.path };

    const expectedActions = [
      { type: TYPES.MOVE_FOLDER },
      {
        type: TYPES.MOVE_FOLDER_SUCCESS,
        payload
      }
    ];

    expect(store.getActions()).toEqual(expectedActions);
  });

  it('moves a folder from another folder to ROOT', () => {
    let params = {
      id: 542,
      root: true,
      team_id: 1
    };
    const payload = {
      params: params,
      folder: { ...move.item, folder_id: null },
      path: [{ ...move.path[0], folder_id: null }]
    };

    const oldFolder = store.getState().folders.list.find(f => f.id === params.id);

    const newState = folders(store.getState().folders, {
      type: TYPES.MOVE_FOLDER_SUCCESS,
      payload
    });
    store = mockStore({
      ...defaults,
      folders: { ...newState, collapsed: { [oldFolder.folder_id]: true } }
    });
    const { folderTreeWrapper } = setup();
    const root_folders = store.getState().folders.list.filter(f => f.root);
    const movedFolder = newState.list.find(f => f.id === params.id);

    expect(movedFolder.folder_id).toEqual(null);
    expect(folderTreeWrapper.find('.folder-tree').children().length).toBe(root_folders.length);
    expect(
      folderTreeWrapper
        .find('li[data-id=' + oldFolder.folder_id + ']')
        .find('.child-wrap')
        .find('li[data-id=' + payload.folder.id + ']').length
    ).toBe(0);
  });
});
