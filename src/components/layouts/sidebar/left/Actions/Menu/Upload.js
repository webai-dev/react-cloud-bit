import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { setUploadingStatus, setUploadingData } from 'components/dropzone/_actions';
import { createFile, addCreatedFile, uploadFile } from 'views/files/_actions';
import { createFolder } from 'views/folders/_actions';
import Notifications from 'react-notification-system-redux';
import SvgRender from 'components/general/SvgRender';

import styled from 'react-emotion';

let uploading = 0;

class Upload extends Component {
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

    const filename = params.data.name;
    const dotPos = params.data.name.lastIndexOf('.');

    let f = {
      filename: dotPos !== -1 ? filename.slice(0, dotPos) : filename,
      extension: dotPos !== -1 ? filename.slice(dotPos + 1) : '',
      data: params.data,
      name: params.data.name,
      folder_id: params.folder_id,
      status: 'uploading',
      id: uploading
    };
    this.props.setUploadingData({ uploading: f });

    const current_folder = this.props.active_folder;

    this.props.uploadFile(f).then(data => {
      this.props.setUploadingData({ uploading: { ...f, status: 'done' } });
      if (params.folder_id === current_folder && data) this.props.addCreatedFile(data);
    });
    // this.props.createFile(fd).then(data => {
    //   this.props.setUploadingData({ uploading: { ...f, status: 'done' } });
    //
    //   if (params.folder_id === current_folder && data) this.props.addCreatedFile(data);
    // });
  };

  render() {
    return (
      <Fragment>
        <input
          type="file"
          value={''}
          name={`file`}
          id={`upload_file`}
          onChange={this.handleFileSelection}
          style={{ display: 'none' }}
          multiple
        />
        <div
          className={`btn dropdown-item btn-dropdown-icon btn-upload-icon ${
            !this.props.active_folder ? 'disabled' : ''
          }`}
          onClick={e => this.props.active_folder && this.handleUpload(e, 'file')}
        >
          <SvgRender
            path={require('assets/svg/actions/upload.svg')}
            svgStyle={{ width: 24 }}
            wrapperClassName="pr-1"
          />
          <Title>Upload File(s)</Title>
        </div>
        <div
          className="btn dropdown-item btn-dropdown-icon border-0"
          onClick={e => this.handleUpload(e, 'folder')}
        >
          <SvgRender
            path={require('assets/svg/actions/upload.svg')}
            svgStyle={{ width: 24 }}
            wrapperClassName="pr-1"
          />
          <Title>Upload Folder</Title>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    active_folder: state.folders.active,
    active_team: state.teams.active,
    status: state.dropzone.status
  }),
  dispatch => ({
    createFolder: e => dispatch(createFolder(e)),
    createFile: e => dispatch(createFile(e)),
    uploadFile: e => dispatch(uploadFile(e)),
    addCreatedFile: e => dispatch(addCreatedFile(e)),
    setUploadingStatus: e => dispatch(setUploadingStatus(e)),
    setUploadingData: e => dispatch(setUploadingData(e)),
    notification: message => {
      let notificationOpts = { position: 'br' };
      notificationOpts.message = message;

      dispatch(Notifications.error(notificationOpts));
    }
  })
)(Upload);

const Title = styled('div')`
  font-size: 14px;
`;
