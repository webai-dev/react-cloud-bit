import { mock } from 'utils/api';
import { default as mockStore } from 'utils/store';

import defaults from 'utils/store/tests';

import edit from 'utils/api/tests/folders/_edit';

import * as TYPES from '../_types';
import folders from '../_reducers';
import { INITIAL_STATE } from '../_reducers';
import { renameFolder } from '../_actions';

describe('Folders', () => {
  let store = mockStore(defaults);

  beforeEach(() => {
    store.clearActions();
    // moxios.install()
  });

  afterEach(() => {
    mock.reset();
    mock.restore();
  });

  describe('actions', () => {
    describe('initializing', () => {
      it('should return the initial state', () => {
        expect(folders(INITIAL_STATE, {})).toEqual(INITIAL_STATE);
      });
    });

    describe('editing', () => {
      it('creates RENAME_FOLDER_SUCCESS action', async () => {
        let params = { id: 736, team_id: 1, title: 'My photos 2' };

        mock.onPut(`folders/${params.id}`).reply(200, edit);
        const res = await renameFolder(params)(store.dispatch);
        const payload = { params: params, folder: res };

        const expectedActions = [
          { type: TYPES.RENAME_FOLDER },
          {
            type: TYPES.RENAME_FOLDER_SUCCESS,
            payload
          }
        ];

        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should rename folder', () => {
        let params = { id: 736, team_id: 1, title: 'My photos 2' };
        const payload = { params, folder: edit };

        const newState = folders(store.getState().folders, {
          type: TYPES.RENAME_FOLDER_SUCCESS,
          payload
        });

        const updatedFolder = newState.list.find(f => f.id === params.id);
        expect(updatedFolder.title).toEqual(params.title);
      });
    });

    describe('deleting', () => {
      it('should remove folder from state', () => {
        let params = {
          old_folder_id: 482,
          id: 542,
          team_id: 1
        };

        const payload = {
          params
        };

        const newState = folders(store.getState().folders, {
          type: TYPES.DELETE_FOLDER_SUCCESS,
          payload
        });
        const deletedFolder = newState.list.find(f => f.id === params.id);

        expect(newState.list).not.toEqual(expect.arrayContaining([deletedFolder]));
      });
    });
  });
});
