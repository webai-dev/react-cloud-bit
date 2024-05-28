import React, { Component } from 'react';
import { connect } from 'react-redux';
import Notifications from 'react-notification-system-redux';
import styled from 'react-emotion';
import { withRouter } from 'react-router-dom';

import { createFolder } from 'views/folders/_actions';
import { createFile, uploadFile, fetchFolderFiles, addCreatedFile } from 'views/files/_actions';
import { setUploadingStatus, setUploadingData } from './_actions';

import variables from 'assets/sass/partials/_exports.scss';
import LoaderCheckmark from 'components/general/LoaderCheckmark';

let uploading = 0;
let totals = 0;
let dropzone;
let header;

export class DirDropZone extends Component {
  constructor(props) {
    super(props);

    this.state = { current_folder: null };
  }

  refetchFolderFiles() {
    this.props.fetchFolderFiles({
      team_id: this.props.active_team.id,
      folder_id: this.state.current_folder
    });
  }

  uploadFile(params) {
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

    totals++;
    this.props.setUploadingData({ totals });

    const current_folder = this.props.active_folder;

    this.props.uploadFile(f).then(data => {
      this.props.setUploadingData({ uploading: { ...f, status: 'done' } });
      if (params.folder_id === current_folder && data) this.props.addCreatedFile(data);
    });
  }

  scanFiles(item, parent) {
    let folder_id = parent;

    if (item.isDirectory) {
      let directoryReader = item.createReader();

      // create new folder
      this.props
        .createFolder({
          team_id: this.props.active_team.id,
          folder_id: folder_id,
          title: item.name,
          drop: true
        })
        .then(data => {
          if (data && data.id) {
            if (data.id == this.state.current_folder) {
              // this.refetchFolderFiles();
            }

            folder_id = data.id;

            directoryReader.readEntries(entries => {
              // totals = totals + entries.filter(f => f.isFile).length;
              // this.props.setUploadingData({ totals });

              entries.forEach((entry, i) => {
                this.scanFiles(entry, folder_id);
              });
            });
          }
        });
    } else if (item.isFile) {
      item.file(file => {
        this.uploadFile({
          team_id: this.props.active_team.id,
          folder_id: folder_id,
          data: file,
          drop: true
        });
      });
    }
  }

  allowDrop(target) {
    const curLocation = this.props.history.location.pathname;
    const pathAllowed = curLocation === '/' || curLocation.startsWith('/folder');
    const cursorLocationAllowed = dropzone.contains(target) && !header.contains(target);
    const dropsAllowed = pathAllowed && cursorLocationAllowed;

    if (dropsAllowed) {
      dropzone.classList.add('dragging');
    } else {
      dropzone.classList.remove('dragging');
    }

    return dropsAllowed;
  }

  componentDidMount() {
    dropzone = document.getElementById('main');
    header = document.getElementById('header');

    window.addEventListener(
      'mouseout',
      event => {
        dropzone.classList.remove('dragging');
      },
      false
    );

    //Prevent fromclosing the tab when uploading
    window.onbeforeunload = event => {
      if (this.props.status === 'uploading') {
        return '';
      } else {
        window.onbeforeunload = null;
      }
    };

    document.addEventListener('drag', event => {}, false);
    document.addEventListener(
      'dragover',
      event => {
        event.preventDefault();
        this.allowDrop(event.target);
      },
      false
    );
    document.addEventListener(
      'dragstart',
      event => {
        this.allowDrop(event.target);
      },
      false
    );
    document.addEventListener(
      'dragenter',
      event => {
        this.allowDrop(event.target);
      },
      false
    );
    document.addEventListener(
      'dragleave',
      event => {
        this.allowDrop(event.target);
      },
      false
    );
    document.addEventListener(
      'drop',
      event => {
        event.preventDefault();

        if (this.allowDrop(event.target)) {
          if (this.props.status === 'uploading') {
            this.props.notification('Upload already in progress');
            dropzone.classList.remove('dragging');
            // this.props.setUploadingStatus('uploading');
          } else {
            this.setState({ current_folder: this.props.active_folder }, () => {
              uploading = 0;
              totals = 0;
              dropzone.classList.remove('dragging');

              if (event.dataTransfer.items) {
                if (event.dataTransfer.items.length > 0) {
                  let items = event.dataTransfer.items;

                  for (let i = 0; i < items.length; i++) {
                    let item = items[i].webkitGetAsEntry();

                    if (item) {
                      if (this.props.status !== 'uploading')
                        this.props.setUploadingStatus('uploading');

                      this.scanFiles(item, this.state.current_folder);
                    }
                  }
                }
              } else if (event.dataTransfer.files) {
                if (event.dataTransfer.files.length > 0) {
                  if (this.props.status !== 'uploading') this.props.setUploadingStatus('uploading');

                  let files = event.dataTransfer.files;
                  // this.props.setUploadingData({ totals: files.length });

                  for (var i = 0; i < files.length; i++) {
                    this.uploadFile({
                      team_id: this.props.active_team.id,
                      folder_id: this.state.current_folder,
                      data: files[i],
                      drop: true
                    });
                  }
                }
              } else {
                this.props.notification(
                  'Folder upload is not supported by your browser. Try using a different one like Chrome or Mozilla.'
                );
              }
            });
          }
        }
      },
      false
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const done = this.props.uploading.filter(up => up.status === 'done').length;
    if (
      done !== 0 &&
      this.props.totals !== 0 &&
      done === this.props.totals &&
      prevProps.status === 'uploading'
    ) {
      setTimeout(() => {
        this.props.setUploadingStatus('');
        this.props.setUploadingData({ totals: 0, uploading: 0 });
        // uploading = 0;
        // totals = 0;
        // if (this.state.current_folder === this.props.active_folder) this.refetchFolderFiles();
      }, 1000);
    }
  }

  render() {
    return (
      <DirDropZoneWrap>
        {this.props.status === 'uploading' && (
          <div className="dropzone-area-wrapper d-flex align-items-center pl-2 pr-2">
            <div className="dropzone-uploading">
              <div className="uploading-progress d-flex align-items-center">{`Completed ${
                this.props.uploading.filter(up => up.status === 'done').length
              } of ${this.props.totals}`}</div>

              {this.props.uploading.length > 0 && (
                <ul className="list-unstyled uploading-list">
                  {this.props.uploading.map((up, index) => (
                    <li key={index}>
                      {up.name}
                      <div className="dropzone-icon d-flex align-items-center justify-conter-center">
                        <LoaderCheckmark complete={up.status === 'done' ? true : false} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </DirDropZoneWrap>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    createFolder: e => dispatch(createFolder(e)),
    createFile: e => dispatch(createFile(e)),
    uploadFile: e => dispatch(uploadFile(e)),
    addCreatedFile: e => dispatch(addCreatedFile(e)),
    fetchFolderFiles: e => dispatch(fetchFolderFiles(e)),
    setUploadingStatus: e => dispatch(setUploadingStatus(e)),
    setUploadingData: e => dispatch(setUploadingData(e)),
    notification: message => {
      let notificationOpts = { position: 'br' };
      notificationOpts.message = message;

      dispatch(Notifications.error(notificationOpts));
    }
  };
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    active_folder: state.folders.active,
    status: state.dropzone.status,
    uploading: state.dropzone.uploading,
    totals: state.dropzone.totals
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DirDropZone)
);

const DirDropZoneWrap = styled('div')`
  .dropzone-area-wrapper {
    position: fixed;
    width: 320px;
    bottom: ${variables.size40};
    right: ${variables.size40};
  }

  .dropzone-uploading {
    color: ${variables.zoneGray};
    width: 100%;
  }

  .uploading-progress {
    background: ${variables.head};
    height: 40px;
    padding: 0 ${variables.size16};
  }

  .uploading-list {
    background: #fff;
    border: 1px solid ${variables.linesGray};
    max-height: 101px;
    overflow-y: auto;

    > li {
      color: ${variables.head};
      padding: ${variables.size8} ${variables.size32} ${variables.size8} ${variables.size16};
      border-bottom: 1px solid ${variables.linesGray};
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      .dropzone-icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 32px;
        height: 100%;
      }
    }
  }
`;
