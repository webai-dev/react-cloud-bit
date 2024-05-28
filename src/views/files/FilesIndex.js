import React, { Component } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import sort from 'utils/sort';

import { TableBody, TableHeader, TableRow } from 'components/table';
import SimpleModal from 'components/modals/SimpleModal';
import CollapseItems from 'components/general/CollapseItems';
import DeletePreventation from 'components/modals/DeletePrevention';
import MoveTreeModal from 'components/modals/MoveTreeModal';
import FileEdit from 'views/files/FileEdit';
import PreviewModal from 'components/modals/PreviewModal';
import SharingModal from 'views/shares/SharingModal';
import FileRow from './FileRow';

import { MSG } from 'utils/alerts';
import { deleteFile, fetchFile, changeFileVersion, selectFile } from 'views/files/_actions';
import { deleteShare, selectSharedFile } from 'views/shares/_actions';
import { lockItem } from 'views/dashboard/_actions';
import { getSelectedItems } from 'state/bulk/_helpers';
import { filtersExpandCollapse } from 'state/filters/_actions';
import { deleteShortcut } from 'state/shortcuts/_actions';

class FilesIndex extends Component {
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
    this.handleDeleteAction = this.handleDeleteAction.bind(this);
    this.handleDownloadAction = this.handleDownloadAction.bind(this);
    this.handleLockAction = this.handleLockAction.bind(this);
    this.handleShortcutDeleteAction = this.handleShortcutDeleteAction.bind(this);
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  toggleFolderActions() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  triggerModalAction(e, type, file) {
    e.preventDefault();
    let modalActions = {};

    modalActions.editFile = {
      title: 'Rename file',
      modal: <FileEdit file={file} toggle={this.toggleModal} />
    };

    modalActions.moveFile = {
      title: `Move ${file.title} to folder`,
      modal: (
        <MoveTreeModal
          shareable_type="file"
          type="move"
          item={file}
          file={true}
          toggle={this.toggleModal}
        />
      )
    };

    modalActions.copyFile = {
      title: `Copy ${file.title} to folder`,
      modal: (
        <MoveTreeModal
          shareable_type="file"
          type="copy"
          item={file}
          file={true}
          toggle={this.toggleModal}
        />
      )
    };

    modalActions.createShortcutFile = {
      title: `Create shortcut of ${file.title} in folder`,
      modal: (
        <MoveTreeModal
          type="shortcut"
          shareable_type="file"
          item={file}
          file={true}
          toggle={this.toggleModal}
          inShares={this.props.inShares}
        />
      )
    };

    modalActions.deleteFile = {
      title: file.is_shortcut
        ? MSG.SHORTCUT_REMOVE_PREVENTION_TITLE(file.title)
        : this.props.inShares
        ? MSG.SHARE_REMOVE_PREVENTION_TITLE(file.title)
        : MSG.FILE_DELETE_PREVENTION_TITLE(file.title),
      modal: (
        <DeletePreventation
          item={file}
          body={
            file.is_shortcut
              ? MSG.SHORTCUT_REMOVE_PREVENTION_TEXT('file')
              : this.props.inShares
              ? MSG.SHARE_REMOVE_PREVENTION_TEXT('file')
              : MSG.FILE_DELETE_PREVENTION_TEXT
          }
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleDeleteAction}
        />
      )
    };

    modalActions.deleteShortcut = {
      title: MSG.SHORTCUT_REMOVE_PREVENTION_TITLE(file.title),
      modal: (
        <DeletePreventation
          item={file}
          body={MSG.SHORTCUT_REMOVE_PREVENTION_TEXT('file')}
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleShortcutDeleteAction}
        />
      )
    };

    modalActions.shareFile = {
      title: `Share ${file.title}`,
      modal: <SharingModal item={file} shareable_type="file" toggle={this.toggleModal} />
    };

    modalActions.previewFile = {
      title: '',
      modal: (
        <PreviewModal
          item={file}
          files={this.props.files}
          active_team={this.props.active_team}
          toggle={this.toggleModal}
          actions={{
            fetchFile: this.props.fetchFile,
            downloadFile: this.handleDownloadAction
          }}
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

  handleDeleteAction(e, item) {
    let params = { team_id: this.props.active_team.id };

    if (item.is_shortcut) {
      params.shortcut_id = item.shortcut_id;
      params.shareable_type = 'file';
    } else if (this.props.inShares) {
      params.id = item.share.id;
      params.user_id = this.props.user.id;
    } else {
      params.id = item.id;
    }

    (item.is_shortcut
      ? this.props.deleteShortcut(params)
      : this.props.inShares
      ? this.props.deleteShare(params)
      : this.props.deleteFile(params)
    ).then(data => {
      if (data) {
        this.toggleModal();
        this.props.history.push(`/folder/${data.folder_id}`);
      }
    });
  }

  handleShortcutDeleteAction(e, item) {
    let params = { team_id: this.props.active_team.id };

    params.shortcut_id = item.shortcut_id;
    params.shareable_type = 'file';
    this.props.deleteShortcut(params).then(data => {
      if (data) this.toggleModal();
    });
  }

  handleDownloadAction(e, file) {
    this.props
      .fetchFile({
        team_id: this.props.active_team.id,
        file_id: file.id
      })
      .then(data => {
        if (data) {
          let a = document.createElement('a');
          a.href = data.url;
          a.download = file.title;
          document.body.appendChild(a);
          a.click();
          setTimeout(function() {
            document.body.removeChild(a);
          }, 0);
        }
      });
  }

  handleLockAction(e, file) {
    this.props.lockItem({ type: 'files', id: file.id, team_id: this.props.active_team.id });
  }

  render() {
    const {
      active_folder,
      files,
      selected_files,
      isLastInOrder,
      collapse,
      filtersExpandCollapse,
      ignoreSortOrder
    } = this.props;

    return (
      <div className={`row ${isLastInOrder ? '' : 'mb-10'}`}>
        <CollapseItems
          collapse={collapse && this.props.match && !this.props.match.params.bit_id}
          title="Files"
          count={files.length}
          expand={() => filtersExpandCollapse('files')}
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
                <TableHeader grow="4" title="Name" />
                <TableHeader grow="1" title="Size" />
                <TableHeader grow="1" title="Modified" />
                <TableHeader grow="0" className="col-1" title="" />
                <TableHeader grow="0" className="col-1" title="" />
                <TableHeader grow="0" className="col-1" title="" />
              </TableRow>
              {(ignoreSortOrder ? files : sort(files, this.props.sortBy)).map((column, index) => (
                <FileRow
                  key={column.id}
                  file={column}
                  team={this.props.active_team}
                  disabled={this.props.user.role.label === 'guest'}
                  action={this.triggerModalAction}
                  download={this.handleDownloadAction}
                  lock={this.handleLockAction}
                  changeVersion={this.props.changeFileVersion}
                  selectFile={
                    this.props.active_folder ? this.props.selectFile : this.props.selectSharedFile
                  }
                  selected={this.props.selected_files}
                  inShares={this.props.inShares}
                  active_folder={active_folder}
                  user={this.props.user}
                />
              ))}
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
            modalClassName={this.state.modalAction === 'previewFile' ? 'modal-preview' : ''}
            headerActions={this.state.modalAction === 'previewFile' ? true : false}
          />
        </CollapseItems>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    active_team: state.teams.active,
    active_folder: state.folders.active,
    selected_files: getSelectedItems(state).selected_files,
    sortBy: state.filters.sortBy,
    isLastInOrder: state.filters.order.files === 2,
    collapse: state.filters.collapse.files
  };
}

export default connect(
  mapStateToProps,
  {
    filtersExpandCollapse,
    deleteFile,
    fetchFile,
    changeFileVersion,
    selectFile,
    selectSharedFile,
    lockItem,
    deleteShortcut,
    deleteShare
  }
)(FilesIndex);
