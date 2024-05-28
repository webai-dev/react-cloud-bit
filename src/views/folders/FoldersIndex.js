import React, { Component } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import sort from 'utils/sort';
import { MSG } from 'utils/alerts';

import { TableBody, TableHeader, TableRow } from 'components/table';
import SimpleModal from 'components/modals/SimpleModal';
import MoveTreeModal from 'components/modals/MoveTreeModal';
import CollapseItems from 'components/general/CollapseItems';
import SharingModal from 'views/shares/SharingModal';
import FolderRow from './FolderRow';

import { setClickActiveFolder, selectFolder } from './_actions';
import { selectSharedFolder } from 'views/shares/_actions';
import { getSelectedItems } from 'state/bulk/_helpers';
import { deleteShortcut } from 'state/shortcuts/_actions';
import { filtersExpandCollapse } from 'state/filters/_actions';
import DeletePreventation from 'components/modals/DeletePrevention';

class FoldersIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      modalAction: '',
      modalActions: {},
      dropdownOpen: false
    };

    this.triggerModalAction = this.triggerModalAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  triggerModalAction(e, type, folder) {
    let modalActions = {};

    modalActions.shareFolder = {
      title: `Share ${folder.title}`,
      modal: <SharingModal item={folder} shareable_type="folder" toggle={this.toggleModal} />
    };

    modalActions.createShortcutFolder = {
      title: `Create shortcut of ${folder.title} in folder`,
      modal: (
        <MoveTreeModal
          item={folder}
          root={true}
          folder={true}
          type="shortcut"
          toggle={this.toggleModal}
          handleMove={this.handleFolderMoveAction}
          shareable_type="folder"
        />
      )
    };

    modalActions.deleteShortcutFolder = {
      title: MSG.SHORTCUT_REMOVE_PREVENTION_TITLE(folder.title),
      modal: (
        <DeletePreventation
          item={folder}
          body={MSG.SHORTCUT_REMOVE_PREVENTION_TEXT('folder')}
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleShortcutDeleteAction}
        />
      )
    };

    this.setState(
      {
        modalActions: modalActions,
        modalAction: modalActions[type] ? type : ''
      },
      this.toggleModal
    );
  }

  handleFolderMoveAction = folder => {
    this.props.history.push(`/folder/${folder.folder_id}`);
  };

  handleShortcutDeleteAction = (e, item) => {
    let params = { team_id: this.props.active_team.id };
    params.id = item.id;

    params.shortcut_id = item.shortcut_id;
    params.shareable_type = 'folder';
    this.props.deleteShortcut(params).then(data => {
      if (data) {
        this.toggleModal();

        if (
          item.id == this.props.active_folder ||
          (data.shareable_type === 'folder' && data.shareable_id == this.props.active_folder)
        ) {
          if (item.folder_id) this.props.history.push(`/folder/${item.folder_id}`);
          else this.props.history.push(`/`);
        }
      }
    });
  };

  render() {
    const {
      folders,
      selected_folders,
      active_clicked,
      isLastInOrder,
      collapse,
      filtersExpandCollapse,
      ignoreSortOrder
    } = this.props;

    return (
      <div className={`row ${isLastInOrder ? '' : 'mb-10'}`}>
        <CollapseItems
          collapse={collapse}
          title="Folders"
          count={folders.length}
          expand={() => filtersExpandCollapse('folders')}
        >
          <div className="col-12">
            <TableBody className="table">
              <TableRow
                className="table-header"
                className={css`
                  position: relative;
                `}
              >
                <TableHeader small />
                <TableHeader grow="5" title="Name" />
                <TableHeader grow="1" title="Modified" />
                <TableHeader grow="0" className="col-1" title="" />
                <TableHeader grow="0" className="col-1" title="" />
                <TableHeader grow="0" className="col-1" title="" />
              </TableRow>
              {(ignoreSortOrder ? folders : sort(folders, this.props.sortBy)).map(
                (column, index) => (
                  <FolderRow
                    key={column.id}
                    folder={column}
                    disabled={this.props.user.role.label === 'guest'}
                    action={this.triggerModalAction}
                    active_folder={this.props.active_folder}
                    click_active_folder={active_clicked}
                    setClickActiveFolder={this.props.setClickActiveFolder}
                    selected={this.props.selected_folders}
                    selectFolder={
                      this.props.active_folder || this.props.root
                        ? this.props.selectFolder
                        : this.props.selectSharedFolder
                    }
                    inShares={this.props.inShares}
                    user={this.props.user}
                  />
                )
              )}
            </TableBody>
          </div>

          <SimpleModal
            header={
              this.state.modalActions[this.state.modalAction]
                ? this.state.modalActions[this.state.modalAction].title
                : ''
            }
            body={
              this.state.modalActions[this.state.modalAction]
                ? this.state.modalActions[this.state.modalAction].modal
                : ''
            }
            modalOpen={this.state.modalOpen}
            toggle={this.toggleModal}
          />
        </CollapseItems>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    active_team: state.teams.active,
    active_folder: state.folders.active,
    active_clicked: state.folders.click_active,
    selected_folders: getSelectedItems(state).selected_folders,
    sortBy: state.filters.sortBy,
    isLastInOrder: state.filters.order.folders === 2,
    collapse: state.filters.collapse.folders
  };
}

export default connect(
  mapStateToProps,
  {
    filtersExpandCollapse,
    setClickActiveFolder,
    selectFolder,
    selectSharedFolder,
    deleteShortcut
  }
)(FoldersIndex);
