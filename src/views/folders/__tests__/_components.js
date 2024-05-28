import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
// import { MemoryRouter as Router } from 'react-router-dom';

import { default as mockStore } from 'utils/store';
import defaults from 'utils/store/tests';

import FolderTreeItem from '../FolderTreeItem';
import FolderTree from '../FolderTree';

describe('Folders', () => {
  let store = mockStore(defaults);

  beforeEach(() => {
    store.clearActions();
  });

  describe('components', () => {
    describe('FolderTree', () => {
      const setup = () => {
        const props = {
          active: null,
          rootActive: false,
          rootOpen: true,
          rightClick: true
        };

        const enzymeWrapper = mount(
          <Provider store={store}>
            <FolderTree {...props} />
          </Provider>
        );

        return {
          props,
          enzymeWrapper
        };
      };
      const { enzymeWrapper } = setup();
      const root_folders = store.getState().folders.list.filter(f => f.root);

      it('should render folders list', () => {
        expect(enzymeWrapper.find('ul').hasClass('shares-list')).toBe(true);
      });
    });

    describe('Folder tree item', () => {
      const folder = defaults.folders.list.find(f => f.id === 482);
      const props = {
        folder,
        active: null,
        active_clicked_folder_id: null,
        collapsed: {},
        handleShareClick: () => {},
        folders: defaults.folders.list,
        rightClick: true
      };

      it('checks if folder has active class', () => {
        const wrapper = shallow(<FolderTreeItem {...props} active={folder.id} />);
        expect(wrapper.hasClass('active')).toBe(true);
      });

      it('checks if folder has folder-shared class', () => {
        const wrapper = shallow(
          <FolderTreeItem {...props} folder={{ ...props.folder, shares_count: 4 }} />
        );
        expect(wrapper.find('.folder-shared').length).toBe(1);
      });

      it('checks if folder has children', () => {
        const wrapper = shallow(<FolderTreeItem {...props} collapsed={{ [folder.id]: true }} />);

        expect(wrapper.find('.btn-arrow').hasClass('btn-open')).toBe(true);
        expect(wrapper.find('.child-wrap').length).toBe(1);
        expect(wrapper.find('.child-wrap ul').children().length).toBe(
          props.folders.filter(f => f.folder_id === props.folder.id).length
        );
      });
    });
  });
});
