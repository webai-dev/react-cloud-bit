import React, { Component } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import onClickOutside from 'react-onclickoutside';

import SimpleModal from 'components/modals/SimpleModal';
import DeletePreventation from 'components/modals/DeletePrevention';
import MoveTreeModal from 'components/modals/MoveTreeModal';
import SharingModal from 'views/shares/SharingModal';
import ButtonIcon from 'components/general/ButtonIcon';
import FolderEdit from './FolderEdit';

import { MSG } from 'utils/alerts';
import { createFile, addCreatedFile } from 'views/files/_actions';
import { setUploadingStatus, setUploadingData } from 'components/dropzone/_actions';
import { setClickActiveFolder, createFolder, deleteFolder } from 'views/folders/_actions';
import { deleteShortcut } from 'state/shortcuts/_actions';
import { deleteShare } from 'views/shares/_actions';

let uploading = 0;

class FolderActionsPopUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      modalAction: '',
      modalActions: {}
    };

    this.triggerModalAction = this.triggerModalAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleFolderMoveAction = this.handleFolderMoveAction.bind(this);
    this.handleDeleteAction = this.handleDeleteAction.bind(this);
    this.handleShortcutDeleteAction = this.handleShortcutDeleteAction.bind(this);
    this.isInShares = this.isInShares.bind(this);
  }

  hidePopUp() {
    let popUp = document.getElementById('sharing-options');

    if (this.state.modalOpen) {
      popUp.classList.remove('show');
    } else {
      this.props.setClickActiveFolder({
        current: {},
        last: this.props.active_clicked.last,
        position: { top: 0, left: 0 }
      });
    }
  }

  toggleModal() {
    this.setState(
      {
        modalOpen: !this.state.modalOpen
      },
      this.hidePopUp
    );
  }

  clearFolderButton() {
    const folderActions = document.getElementById('folder-actions');
    if (folderActions) folderActions.classList.remove('btn-open');
  }

  handleClickOutside = e => {
    const el = document.getElementById('sharing-options');

    if (!el.contains(e.target) && !this.state.modalOpen) {
      this.props.setClickActiveFolder({
        current: {},
        last: this.props.active_clicked.last,
        position: { top: 0, left: 0 }
      });
    }
  };

  triggerModalAction(e, type, folder) {
    let modalActions = {};
    const click_folder = { ...this.props.active_clicked.last };
    const inShares = this.isInShares() && click_folder.view !== 'sidebar';

    modalActions.renameFolder = {
      title: `Rename folder`,
      modal: <FolderEdit folder={click_folder} toggle={this.toggleModal} />
    };

    modalActions.moveFolder = {
      title: `Move ${click_folder.title} to folder`,
      modal: (
        <MoveTreeModal
          item={click_folder}
          root={true}
          folder={true}
          type="move"
          toggle={this.toggleModal}
          handleMove={this.handleFolderMoveAction}
        />
      )
    };

    modalActions.createShortcutFolder = {
      title: `Create shortcut of ${click_folder.title} in folder`,
      modal: (
        <MoveTreeModal
          item={click_folder}
          root={true}
          folder={true}
          type="shortcut"
          toggle={this.toggleModal}
          handleMove={this.handleFolderMoveAction}
        />
      )
    };

    modalActions.deleteFolder = {
      title: click_folder.is_shortcut
        ? MSG.SHORTCUT_REMOVE_PREVENTION_TITLE(click_folder.title)
        : inShares
        ? MSG.SHARE_REMOVE_PREVENTION_TITLE(click_folder.title)
        : MSG.FOLDER_DELETE_PREVENTION_TITLE(click_folder.title),
      modal: (
        <DeletePreventation
          item={click_folder}
          body={
            click_folder.is_shortcut
              ? MSG.SHORTCUT_REMOVE_PREVENTION_TEXT('folder')
              : inShares
              ? MSG.SHARE_REMOVE_PREVENTION_TEXT('folder')
              : MSG.FOLDER_DELETE_PREVENTION_TEXT
          }
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleDeleteAction}
        />
      )
    };

    modalActions.deleteShortcut = {
      title: MSG.SHORTCUT_REMOVE_PREVENTION_TITLE(click_folder.title),
      modal: (
        <DeletePreventation
          item={click_folder}
          body={MSG.SHORTCUT_REMOVE_PREVENTION_TEXT('folder')}
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleShortcutDeleteAction}
        />
      )
    };

    modalActions.shareFolder = {
      title: `Share ${click_folder.title}`,
      modal: <SharingModal item={click_folder} shareable_type="folder" toggle={this.toggleModal} />
    };

    this.setState(
      {
        modalActions: modalActions,
        modalAction: modalActions[type] ? type : ''
      },
      this.toggleModal
    );

    this.clearFolderButton();
  }

  handleDeleteAction(e, item) {
    const inShares = this.isInShares();
    const folder = this.props.active_clicked.last;
    let params = { team_id: this.props.active_team.id };
    params.id = folder.id;

    if (folder.is_shortcut) {
      params.shortcut_id = folder.shortcut_id;
      params.shareable_type = 'folder';
    } else if (inShares) {
      params.id = folder.share ? folder.share.id : folder.share_id;
      params.user_id = this.props.user.id;
    }

    (folder.is_shortcut
      ? this.props.deleteShortcut(params)
      : inShares
      ? this.props.deleteShare(params)
      : this.props.deleteFolder(params)
    ).then(data => {
      if (data) {
        this.toggleModal();

        if (
          folder.id == this.props.active_folder ||
          (data.shareable_type === 'folder' && data.shareable_id == this.props.active_folder)
        ) {
          if (folder.folder_id) this.props.history.push(`/folder/${folder.folder_id}`);
          else this.props.history.push(`/`);
        }
      }
    });
  }

  handleShortcutDeleteAction(e, item) {
    const folder = this.props.active_clicked.last;
    let params = { team_id: this.props.active_team.id };
    params.id = folder.id;

    params.shortcut_id = folder.shortcut_id;
    params.shareable_type = 'folder';

    this.props.deleteShortcut(params).then(data => {
      if (data) {
        this.toggleModal();

        if (
          folder.id == this.props.active_folder ||
          (data.shareable_type === 'folder' && data.shareable_id == this.props.active_folder)
        ) {
          if (folder.folder_id) this.props.history.push(`/folder/${folder.folder_id}`);
          else this.props.history.push(`/`);
        }
      }
    });
  }

  handleFolderMoveAction(folder) {
    this.props.history.push(`/folder/${folder.folder_id}`);
  }

  handleUpload(e, type) {
    const f = document.getElementById('upload_file');

    if (type === 'folder') {
      f.setAttribute('webkitdirectory', '');
      f.setAttribute('directory', '');
    } else {
      f.removeAttribute('webkitdirectory');
      f.removeAttribute('directory');
    }

    f.click();

    const popUp = document.getElementById('sharing-options');
    popUp.classList.remove('show');

    this.clearFolderButton();
  }

  handleFileSelection = async e => {
    let files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      let data = new FormData();
      data.append('file', file, file.name);
      let _file = data.get('file');
      files.push(_file);
    }

    if (this.props.status === 'uploading') {
      this.props.notification('Upload already in progress');
    } else {
      this.props.setUploadingData({ totals: files.length });
      this.props.setUploadingStatus('uploading');

      let directories = [{ name: 'current', id: this.props.active_folder }];

      for (let i = 0; i < files.length; i++) {
        directories = await this.uploadFile(
          files[i],
          ['current', ...files[i].webkitRelativePath.split('/')],
          directories
        );
      }
    }
  };

  uploadFile = async (data, path, directories) => {
    if (path.length > 2) {
      const directory = directories.find(dir => dir.name === path[1]);
      if (!directory) {
        const parentDir = directories.find(dir => dir.name === path[0]);

        const newDir = await this.props.createFolder({
          folder_id: parentDir.id,
          team_id: this.props.active_team.id,
          title: path[1]
        });

        directories.push({ name: path[1], id: newDir.id });
        const newDirs = await this.uploadFile(data, path.slice(1), directories);
        return newDirs;
      } else {
        const newDirs = await this.uploadFile(data, path.slice(1), directories);
        return newDirs;
      }
    } else {
      const parentDir = directories.find(dir => dir.name === path[0]);
      this.uploadFileData({
        team_id: this.props.active_team.id,
        folder_id: parentDir.id,
        data: data
      });
      return directories;
    }
  };

  uploadFileData = params => {
    let fd = new FormData();
    fd.append('data', params.data);
    fd.append('drop', params.drop);
    fd.append('folder_id', params.folder_id);
    fd.append('team_id', params.team_id);

    uploading++;

    let f = {
      name: params.data.name,
      folder_id: params.folder_id,
      status: 'uploading',
      id: uploading
    };
    this.props.setUploadingData({ uploading: f });

    const current_folder = this.props.active_folder;
    this.props.createFile(fd).then(data => {
      this.props.setUploadingData({ uploading: { ...f, status: 'done' } });

      if (params.folder_id === current_folder && data) this.props.addCreatedFile(data);
    });
  };

  handleNewClick(e, type) {
    this.hidePopUp();
    this.props.history.push(
      `/folder/${this.props.active_clicked.last.id}/create${'?type=' + type}`
    );
  }

  isInShares() {
    const { active_clicked } = this.props;

    return (
      this.props.history.location.pathname.startsWith('/shared') ||
      (active_clicked.last && active_clicked.last.in_shared && !active_clicked.last.is_shortcut)
    );
  }

  hasShortcuts() {
    const { active_clicked } = this.props;
    return active_clicked.last && active_clicked.last.shortcut_id;
  }

  render() {
    const { active_clicked } = this.props;
    const inShares = this.isInShares();
    const locked = this.props.active_team.locked;
    return (
      <React.Fragment>
        <input
          type="file"
          value={''}
          name={`file`}
          id={`upload_file`}
          onChange={e => this.handleFileSelection(e)}
          style={{ display: 'none' }}
          multiple
        />
        <div
          className={`dropdown-menu share-actions show ${DropdownMenuStyle}`}
          id="sharing-options"
          style={{ top: active_clicked.position.top, left: active_clicked.position.left }}
        >
          {active_clicked.last && active_clicked.last.id && (
            <div>
              <button
                type="button"
                className="btn dropdown-item btn-dropdown-icon btn-folder-icon"
                onClick={e => this.handleNewClick(e, 'folder')}
                disabled={locked}
              >
                <ButtonIcon icon="folder">New folder</ButtonIcon>
              </button>
              <button
                type="button"
                className="btn dropdown-item btn-dropdown-icon btn-bit-icon"
                onClick={e => this.handleNewClick(e, 'bit')}
                disabled={locked}
              >
                <ButtonIcon icon="bit">New bit</ButtonIcon>
              </button>

              {active_clicked.last.view === 'index' ? (
                <button
                  type="button"
                  className="btn dropdown-item btn-dropdown-icon btn-upload-icon"
                  onClick={e => this.handleUpload(e, 'file')}
                  disabled={locked}
                >
                  <ButtonIcon icon="upload">Upload files</ButtonIcon>
                </button>
              ) : null}
              {active_clicked.last.view === 'index' ? (
                <button
                  type="button"
                  className="btn dropdown-item btn-dropdown-icon btn-upload-icon"
                  onClick={e => this.handleUpload(e, 'folder')}
                  disabled={locked}
                >
                  <ButtonIcon icon="upload">Upload folder</ButtonIcon>
                </button>
              ) : null}
              <button
                type="button"
                className="btn dropdown-item btn-dropdown-icon btn-edit-icon"
                onClick={e => this.triggerModalAction(e, 'renameFolder')}
                disabled={locked}
              >
                <ButtonIcon icon="edit">Rename</ButtonIcon>
              </button>
              {inShares && active_clicked.last.view !== 'sidebar' && !this.hasShortcuts() ? (
                <button
                  type="button"
                  className="btn dropdown-item btn-dropdown-icon btn-shortcut-icon"
                  onClick={e => this.triggerModalAction(e, 'createShortcutFolder')}
                  disabled={locked}
                >
                  <ButtonIcon icon="shortcut">Create shortcut</ButtonIcon>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn dropdown-item btn-dropdown-icon btn-move-icon"
                  onClick={e => this.triggerModalAction(e, 'moveFolder')}
                  disabled={locked}
                >
                  <ButtonIcon icon="move">Move</ButtonIcon>
                </button>
              )}
              <button
                type="button"
                className="btn dropdown-item btn-dropdown-icon btn-share-icon"
                onClick={e => this.triggerModalAction(e, 'shareFolder')}
                disabled={locked}
              >
                <ButtonIcon icon="share">Share</ButtonIcon>
              </button>
              <button
                type="button"
                className="btn dropdown-item btn-dropdown-icon btn-delete-icon"
                onClick={e => this.triggerModalAction(e, 'deleteFolder')}
              >
                <ButtonIcon icon="delete">
                  {inShares && active_clicked.last.view !== 'sidebar'
                    ? 'Remove from Shared'
                    : active_clicked.last.is_shortcut
                    ? 'Remove Shortcut'
                    : 'Delete'}
                </ButtonIcon>
              </button>
            </div>
          )}
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    active_team: state.teams.active,
    active_clicked: state.folders.click_active,
    active_folder: state.folders.active
  };
}

export default connect(
  mapStateToProps,
  {
    deleteFolder,
    setClickActiveFolder,
    createFolder,
    createFile,
    addCreatedFile,
    setUploadingStatus,
    setUploadingData,
    deleteShortcut,
    deleteShare
  }
)(onClickOutside(FolderActionsPopUp));

const DropdownMenuStyle = css`
  position: fixed;
`;
