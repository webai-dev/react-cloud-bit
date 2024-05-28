import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { toggleDetails } from 'components/layouts/sidebar/right/_actions';
import { isDetailsTabOpen } from 'components/layouts/sidebar/right/_selectors';
import { markAsSeen } from 'state/notifications/_actions';
import { getUnseenNotifications } from 'state/notifications/_selectors';
import { selectSharedCount } from 'state/sharedUsers';

import SvgRender from 'components/general/SvgRender';
import styled, { css } from 'react-emotion';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip
} from 'reactstrap';

import { TableCell, TableRow } from 'components/table';
import ButtonIcon from 'components/general/ButtonIcon';
import Copy from 'components/copy';

import variables from 'assets/sass/partials/_exports.scss';
import { icon, fileSize } from 'utils/files';

import bullets from 'assets/svg/general/bullets.svg';

import pp from 'assets/svg/general/shared-pp.svg';
import loader from 'assets/svg/general/loader.svg';
import dashboard from 'assets/svg/general/dashboard.svg';
import sharedShortcut from 'assets/svg/general/shared_shortcut.svg';
import info from 'assets/svg/general/info.svg';
import { fetchFolders } from 'views/folders/_actions';

import { format } from 'utils/dates';

class FileRow extends Component {
  constructor(props) {
    super(props);

    this.state = { uploading: false };
  }

  componentDidMount() {
    this.props.fetchFolders({
      team_id: this.props.team.id,
      folder_id: this.props.file.folder_id
    });
  }

  click(e, type, file) {
    if (type === 'downloadFile') {
      this.props.download(e, file);
    } else {
      this.props.action(e, type, file);
    }
  }

  replaceClick(e, type, file) {
    let f = document.getElementById('file_' + file.id);
    f.click();
  }

  async handleFileSelection(e, file) {
    let f = e.target.files[0];
    let fd = new FormData();
    fd.append('data', f);
    this.setState({ uploading: true });
    this.props.changeVersion({ id: file.id, data: fd }).then(data => {
      this.setState({ uploading: false });
    });
  }

  selectFile(e, file) {
    this.props.selectFile({
      file_id: file.id,
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey || e.metaKey
    });
  }

  isShortcut() {
    const { file } = this.props;
    return file.is_shortcut || file.shortcut_id;
  }

  getBackgroundColor = () => {
    const { file, isDetailsTabOpen, sidebar } = this.props;
    if (isDetailsTabOpen && file.id === sidebar.data.fileId) return variables.rowSelected;
    else if (this.props.selected.indexOf(this.props.file.id) !== -1) return variables.selected;
    else return 'initial';
  };

  render() {
    const {
      file,
      disabled,
      inShares,
      isDetailsTabOpen,
      hasNotifications,
      shares,
      locked
    } = this.props;

    return (
      <TableRow
        onClick={() => hasNotifications && this.props.markAsSeen()}
        className={
          TableRowStyle +
          ' ' +
          css`
            background: ${this.getBackgroundColor()};
          `
        }
      >
        <TableCell small>
          <SelectHanler className={this.isShortcut() && !inShares ? 'shortcut-icon' : ''}>
            {(inShares || this.props.active_folder) && (
              <button
                type="button"
                className={`btn btn-select ${
                  this.props.selected.indexOf(file.id) !== -1 ? 'active' : ''
                }`}
                onClick={e => this.selectFile(e, file)}
              />
            )}
            {file.preview_url ? (
              <ImagePreview src={file.preview_url} width="32" height="32" />
            ) : (
              <SvgRender
                className="icon"
                path={icon(file.mime_type, file.extension)}
                style={{ height: 32 }}
                wrapperClassName="thumb-svg"
              />
            )}
            {hasNotifications && <Bullet />}
          </SelectHanler>
        </TableCell>
        <TableCell grow="4">
          <button
            className="btn btn-empty btn-link p-0"
            onClick={e => this.click(e, 'previewFile', file)}
            disabled={locked}
          >
            {file.title}
          </button>
        </TableCell>
        <TableCell grow="1" className={'file-size'}>
          {fileSize(file.size)}
        </TableCell>

        <TableCell grow="1" className="">
          {format(file.updated_at)}
        </TableCell>
        <TableCell grow="0" className="col-2 p-0 d-flex align-items-center justify-content-end">
          <div className="align-items-center justify-content-start actions">
            <button
              className={`btn d-flex align-items-center btn-empty p-0 ml-2 mr-1 ml-1`}
              onClick={this.props.toggleDetails}
              disabled={locked}
              id={`file-detail-${file.id}`}
            >
              <SvgRender
                style={{ height: 20 }}
                className={`info-icon ${isDetailsTabOpen ? 'active' : ''}`}
                path={info}
              />

              <UncontrolledTooltip
                placement="top"
                delay={{ show: 100 }}
                target={`file-detail-${file.id}`}
              >
                View details
              </UncontrolledTooltip>
            </button>
            {inShares && (
              <button
                className={`btn btn-smaller d-flex align-items-center btn-empty p-0 pr-2 ${
                  this.isShortcut() ? 'active' : ''
                }`}
                onClick={e =>
                  this.isShortcut()
                    ? this.click(e, 'deleteShortcut', file)
                    : this.click(e, 'createShortcutFile', file)
                }
                disabled={locked}
              >
                <SvgRender
                  style={{ height: 20 }}
                  className="shared-shortcut"
                  path={sharedShortcut}
                />
              </button>
            )}

            <Copy id={file.id} tooltip={true} type="file" height={20} />

            <button
              className={`btn btn-smaller d-flex align-items-center btn-empty ml-2 p-0 ${
                file.is_locked ? 'active' : ''
              }`}
              onClick={e => this.props.lock(e, file)}
              disabled={locked}
              id={`add-to-dashboard-${file.id}`}
            >
              <SvgRender style={{ height: 20 }} className="lock-icon" path={dashboard} />
              <UncontrolledTooltip
                placement="top"
                delay={{ show: 100 }}
                target={`add-to-dashboard-${file.id}`}
              >
                {file.is_locked ? 'Remove from dashboard' : `Add to dashboard`}
              </UncontrolledTooltip>
            </button>
          </div>
        </TableCell>
        <TableCell grow="0" className="col-1 p-0 d-flex align-items-center justify-content-center">
          {shares.count > 1 ? (
            <button
              className={`btn btn-empty btn-smaller d-flex align-items-center justify-content-center p-0 ml-2 ${
                !shares.hasIndividualShares ? 'text-icon-inactive' : ''
              }`}
              onClick={e => this.click(e, 'shareFile', file)}
              disabled={locked}
            >
              <SvgRender style={{ height: 14 }} path={pp} />
              <span className="pl-1">{shares.count}</span>
            </button>
          ) : null}
        </TableCell>
        <TableCell grow="0" className="col-1">
          <div
            className={`d-flex align-items-center justify-content-center ${UploadingWrapperStyle}`}
          >
            <UploadHandler
              type="file"
              value={''}
              name={`file_${file.id}`}
              id={`file_${file.id}`}
              onChange={e => this.handleFileSelection(e, file)}
            />
            <UncontrolledDropdown>
              <DropdownToggle className={`btn-dropdown btn-empty btn-smaller btn-small-border`}>
                <SvgRender style={{ height: 16 }} path={bullets} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  className="btn dropdown-item btn-dropdown-icon btn-download-icon"
                  onClick={e => this.click(e, 'downloadFile', file)}
                  disabled={locked}
                >
                  <ButtonIcon icon="download">Download</ButtonIcon>
                </DropdownItem>

                {!disabled && (
                  <Fragment>
                    <DropdownItem
                      className="btn dropdown-item btn-dropdown-icon btn-replace-icon"
                      onClick={e => this.replaceClick(e, 'downloadFile', file)}
                      disabled={locked}
                    >
                      <ButtonIcon icon="replace">Replace</ButtonIcon>
                    </DropdownItem>
                    <DropdownItem
                      className="btn dropdown-item btn-dropdown-icon btn-edit-icon"
                      onClick={e => this.click(e, 'editFile', file)}
                      disabled={locked}
                    >
                      <ButtonIcon icon="edit">Rename</ButtonIcon>
                    </DropdownItem>
                    {this.props.inShares && !this.isShortcut() ? (
                      <DropdownItem
                        className="btn dropdown-item btn-dropdown-icon btn-shortcut-icon"
                        onClick={e => this.click(e, 'createShortcutFile', file)}
                        disabled={locked}
                      >
                        <ButtonIcon icon="shortcut">Create shortcut</ButtonIcon>
                      </DropdownItem>
                    ) : (
                      <DropdownItem
                        className="btn dropdown-item btn-dropdown-icon btn-move-icon"
                        onClick={e => this.click(e, 'moveFile', file)}
                        disabled={locked}
                      >
                        <ButtonIcon icon="move">Move</ButtonIcon>
                      </DropdownItem>
                    )}
                    <DropdownItem
                      className="btn dropdown-item btn-dropdown-icon btn-copy-icon"
                      onClick={e => this.click(e, 'copyFile', file)}
                      disabled={locked}
                    >
                      <ButtonIcon icon="copy">Copy</ButtonIcon>
                    </DropdownItem>
                    <DropdownItem
                      type="button"
                      className="btn dropdown-item btn-dropdown-icon btn-share-icon"
                      onClick={e => this.click(e, 'shareFile', file)}
                      disabled={locked}
                    >
                      <ButtonIcon icon="share">Share</ButtonIcon>
                    </DropdownItem>
                    <DropdownItem
                      className="btn dropdown-item btn-dropdown-icon btn-delete-icon"
                      onClick={e => this.click(e, 'deleteFile', file)}
                    >
                      <ButtonIcon icon="delete">
                        {this.props.inShares
                          ? 'Remove from Shared'
                          : file.is_shortcut
                          ? 'Remove Shortcut'
                          : 'Delete'}
                      </ButtonIcon>
                    </DropdownItem>
                  </Fragment>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>

            {this.state.uploading && (
              <img src={loader} style={{ height: 40 }} className={UploadingStyle} />
            )}
          </div>
        </TableCell>
      </TableRow>
    );
  }
}

export default connect(
  (state, props) => ({
    sidebar: state.sidebar,
    isDetailsTabOpen: isDetailsTabOpen(state, props.file.id),
    hasNotifications: getUnseenNotifications(state, props.file.id, 'file').length > 0,
    shares: selectSharedCount(state, 'file', props.file.id),
    locked: state.teams.active.locked
  }),
  (dispatch, props) => ({
    toggleDetails: () => dispatch(toggleDetails(props.file.id, 'file')),
    markAsSeen: () => dispatch(markAsSeen(props.file.id, 'file')),
    fetchFolders: params => dispatch(fetchFolders(params))
  })
)(FileRow);

const ImagePreview = styled('img')`
  border: 1px solid ${variables.thumbGray};
  border-radius: 5px;
  object-fit: cover;
`;

const UploadHandler = styled('input')`
  display: none;
  svg {
    fill: currentColor;
  }
`;

const TableRowStyle = css`
  .btn-share {
    display: none;
  }
  .actions {
    display: none;
  }
  :hover .actions {
    display: flex;
    position: relative;
    z-index: 1;
  }
`;

const UploadingWrapperStyle = css`
  position: relative;
`;

const UploadingStyle = css`
  position: absolute;
  right: -32px;
  
  > div {
    display: flex;
    align-items-center;
  }
`;

const SelectHanler = styled('div')`
  position: relative;

  .btn-select {
    position: absolute;
    left: -48px;
    top: 8px;
  }

  .thumb-svg {
    height: 32px;

    > div {
      height: 32px;
    }
  }
`;

const Bullet = styled('div')`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -17px;

  width: ${variables.size8};
  height: ${variables.size8};
  border-radius: 50%;
  background: ${variables.iconFlagged};
`;
