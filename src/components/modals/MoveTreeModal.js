import React, { Component } from 'react';
import { connect } from 'react-redux';

import FolderTree from 'views/folders/FolderTree';

import { copyFile, moveFile, fetchFolderFiles } from 'views/files/_actions';
import { moveFolder } from 'views/folders/_actions';
import { moveBit } from 'views/bits/_actions';
import { getSelectedItems, setSelectedItemsParams } from 'state/bulk/_helpers';
import { bulkMove } from 'state/bulk/_actions';
import { moveShortcut, createShortcut } from 'state/shortcuts/_actions';

class MoveTreeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected_folder: {},
      disabled: false,
      root: false,
      rootOpen: true
    };

    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleRootClick = this.handleRootClick.bind(this);
    this.handleSaveAction = this.handleSaveAction.bind(this);
  }

  handleRootClick(type) {
    if (type === 'collapse') {
      this.setState({ rootOpen: !this.state.rootOpen });
    } else {
      this.setState({ selected_folder: {}, root: true });
    }
  }

  handleShareClick(s) {
    let id = s.id;

    this.setState({ selected_folder: { id }, root: false });
  }

  handleSaveAction() {
    let params = { team_id: this.props.active_team.id, folder_id: this.state.selected_folder.id };
    const { item } = this.props;
    this.setState({ disabled: true });

    if (this.props.bulk !== true) {
      if (this.props.type === 'shortcut' && !this.props.folder) {
        params.share_id = item.share.id;
        params.shareable_type = this.props.shareable_type;

        if (this.state.root) {
          delete params.folder_id;
        }

        this.props.createShortcut(params).then(data => {
          if (data) this.props.toggle();
          else this.setState({ disabled: false });
        });
      } else if (this.props.file && this.props.shareable_type === 'file') {
        params.id = item.id;

        if (this.props.type === 'move') {
          if (item.is_shortcut) params.shortcut_id = item.shortcut_id;

          (item.is_shortcut ? this.props.moveShortcut(params) : this.props.moveFile(params)).then(
            data => {
              if (data) this.props.toggle();
              else this.setState({ disabled: false });
            }
          );
        } else {
          this.props.copyFile(params).then(data => {
            if (data) {
              if (this.state.selected_folder.id == this.props.active_folder) {
                this.props.fetchFolderFiles(params);
              }
              this.props.toggle();
            } else {
              this.setState({ disabled: false });
            }
          });
        }
      } else if (this.props.bit && this.props.shareable_type === 'bit') {
        params.id = item.id;

        if (item.is_shortcut) params.shortcut_id = item.shortcut_id;

        (item.is_shortcut ? this.props.moveShortcut(params) : this.props.moveBit(params)).then(
          data => {
            if (data) this.props.toggle();
            else this.setState({ disabled: false });
          }
        );
      } else if (this.props.folder) {
        const folder = { ...item };

        if (this.props.type === 'shortcut') {
          params.share_id = folder.share ? folder.share.id : folder.share_id;
          params.shareable_type = 'folder';
          params.folder = folder;
        } else {
          params.id = folder ? folder.id : null;
        }

        if (folder.is_shortcut) {
          params.shortcut_id = folder.shortcut_id;
        }

        if (this.state.root) {
          delete params.folder_id;
          params.root = true;
        }

        (this.props.type === 'shortcut'
          ? this.props.createShortcut(params)
          : folder.is_shortcut
            ? this.props.moveShortcut(params)
            : this.props.moveFolder(params)
        ).then(data => {
          if (data) {
            this.props.toggle();
          } else {
            this.setState({ disabled: false });
          }
        });
      }
    } else {
      params = {
        ...params,
        ...setSelectedItemsParams({
          bits: this.props.selected_bits,
          files: this.props.selected_files,
          folders: this.props.selected_folders
        })
      };

      if (this.state.root) {
        delete params.folder_id;
        params.root = true;
      }

      this.props.bulkMove(params).then(data => {
        if (data) {
          this.props.toggle();
        } else {
          this.setState({ disabled: false });
        }
      });
    }
  }

  render() {
    const { type } = this.props;

    return (
      <React.Fragment>
        <div className="modal-body">
          <FolderTree
            active={this.state.selected_folder.id}
            rootActive={this.state.root}
            rootOpen={this.state.rootOpen}
            handleShareClick={this.handleShareClick}
            handleRootClick={this.handleRootClick}
            rightClick={false}
            modal={true}
          />
        </div>
        <div className="modal-footer text-right">
          <button
            type="button"
            className="btn btn-success pr-4 pl-4 capitalize"
            onClick={this.handleSaveAction}
            disabled={
              (!this.state.selected_folder.id && !this.state.root) ||
              (this.state.root && this.props.root !== true) ||
              this.state.disabled
                ? true
                : false
            }
          >
            {type}
          </button>
          <button type="button" className="btn btn-remove-link ml-4" onClick={this.props.toggle}>
            Cancel
          </button>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const selected = getSelectedItems(state);

  return {
    active_team: state.teams.active,
    active_folder: state.folders.active,
    selected_bits: selected.selected_bits,
    selected_files: selected.selected_files,
    selected_folders: selected.selected_folders,
    selected_shortcuts: selected.selected_shortcuts
  };
}

export default connect(
  mapStateToProps,
  {
    moveBit,
    copyFile,
    moveFile,
    moveFolder,
    fetchFolderFiles,
    bulkMove,
    moveShortcut,
    createShortcut
  }
)(MoveTreeModal);
