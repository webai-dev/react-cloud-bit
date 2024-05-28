import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { markAsSeen } from 'state/notifications/_actions';
import { getUnseenNotifications } from 'state/notifications/_selectors';
import { isDetailsTabOpen } from 'components/layouts/sidebar/right/_selectors';
import { selectSharedCount } from 'state/sharedUsers';
import { toggleDetails } from 'components/layouts/sidebar/right/_actions';

import styled, { css } from 'react-emotion';
import { Link } from 'react-router-dom';

import SvgRender from 'components/general/SvgRender';
import Copy from 'components/copy';
import { TableCell, TableRow } from 'components/table';
import info from 'assets/svg/general/info.svg';
import { UncontrolledTooltip } from 'reactstrap';

import variables from 'assets/sass/partials/_exports.scss';
import bullets from 'assets/svg/general/bullets.svg';
import pp from 'assets/svg/general/shared-pp.svg';
import sharedFolder from 'assets/svg/general/shared-folder-large.svg';
import sharedShortcut from 'assets/svg/general/shared_shortcut.svg';
import { format } from 'utils/dates';

class FolderRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploading: false
    };
  }

  selectFolder(e, folder) {
    this.props.selectFolder({
      folder_id: this.props.folder.id,
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey || e.metaKey
    });
  }

  handleActionsClick(e, folder) {
    e.stopPropagation();

    const listSize = { x: 310, y: 290 };
    let rect = e.target.getBoundingClientRect();

    // if the list doesn't fit the screen move it up or left by listSize amount of pixels
    const position = {
      left:
        window.innerWidth - (rect.right - 32 + listSize.x) > 0
          ? rect.right - 32 + 'px'
          : rect.right - listSize.x + 'px',
      top:
        window.innerHeight - (rect.top + 32 + listSize.y) > 0
          ? rect.top + 32 + 'px'
          : rect.top - listSize.y + 'px'
    };

    this.props.setClickActiveFolder({
      current: { ...folder, thumb: true },
      last: folder,
      position
    });
  }

  isShortcut() {
    const { folder } = this.props;

    return folder.is_shortcut || folder.shortcut_id;
  }

  getBackgroundColor = () => {
    const { folder, isDetailsTabOpen, sidebar } = this.props;
    if (isDetailsTabOpen && folder.id === sidebar.data.fileId) return variables.rowSelected;
    else if (this.props.selected.indexOf(folder.id) !== -1) return variables.selected;
    else return 'initial';
  };

  render() {
    const { folder, click_active_folder, disabled, hasNotifications, shares, locked } = this.props;
    return (
      <Fragment>
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
            <FolderThumbHanler>
              <button
                type="button"
                className={`btn btn-select ${
                  this.props.selected.indexOf(folder.id) !== -1 ? 'active' : ''
                }`}
                onClick={e => this.selectFolder(e, folder)}
              />
              <SvgRender
                className={`pr-2 ${folder.is_shared ? 'folder-shared' : ''}`}
                style={{ height: 24 }}
                path={sharedFolder}
                wrapperClassName={`thumb-svg ${
                  this.isShortcut() && !this.props.inShares ? 'shortcut-icon' : ''
                }`}
              />
              {hasNotifications && <Bullet />}
            </FolderThumbHanler>
          </TableCell>
          <TableCell grow="5">
            <Link to={`/folder/${folder.id}`} className="folder-title">
              {folder.title}
            </Link>
          </TableCell>
          <TableCell grow="1">{format(folder.updated_at)}</TableCell>
          <TableCell grow="0" className="col-2 p-0 d-flex align-items-center justify-content-end">
            <div className="align-items-center justify-content-start actions">
              <button
                className={`btn d-flex align-items-center btn-empty p-0 ml-2 mr-1 ml-1`}
                onClick={this.props.toggleDetails}
                disabled={locked}
                id={`folder-detail-${folder.id}`}
              >
                <SvgRender style={{ height: 20 }} className={`info-icon `} path={info} />

                <UncontrolledTooltip
                  placement="top"
                  delay={{ show: 100 }}
                  target={`folder-detail-${folder.id}`}
                >
                  View details
                </UncontrolledTooltip>
              </button>

              {this.props.inShares && (
                <button
                  className={`btn btn-smaller d-flex align-items-center btn-empty p-0 pr-2 ${
                    this.isShortcut() ? 'active' : ''
                  }`}
                  onClick={e =>
                    this.isShortcut()
                      ? this.props.action(e, 'deleteShortcutFolder', folder)
                      : this.props.action(e, 'createShortcutFolder', folder)
                  }
                  disabled={locked}
                >
                  <SvgRender
                    style={{ height: 20, width: 20 }}
                    className="shared-shortcut"
                    path={sharedShortcut}
                  />
                </button>
              )}
              <Copy id={folder.id} tooltip={true} type="folder" height={20} />
            </div>
          </TableCell>

          <TableCell
            grow="0"
            className="col-1 p-0 d-flex align-items-center justify-content-center"
          >
            {shares.count > 1 ? (
              <button
                type="button"
                className={`btn btn-empty btn-smaller d-flex align-items-center justify-content-center p-0 ${
                  !shares.hasIndividualShares ? 'text-icon-inactive' : ''
                }`}
                onClick={e => this.props.action(e, 'shareFolder', folder)}
                disabled={locked}
              >
                <SvgRender style={{ height: 14 }} path={pp} />
                <span className="pl-1">{shares.count}</span>
              </button>
            ) : null}
          </TableCell>
          <TableCell grow="0" className="col-1">
            {!disabled && (
              <div className={`d-flex align-items-center justify-content-center`}>
                <button
                  type="button"
                  className={`btn btn-empty btn-smaller btn-small-border btn-actions-handler ${
                    click_active_folder.current && click_active_folder.current.id === folder.id
                      ? 'btn-open'
                      : ''
                  }`}
                  onClick={e => this.handleActionsClick(e, folder)}
                >
                  <SvgRender style={{ height: 16 }} path={bullets} />
                </button>
              </div>
            )}
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }
}

export default connect(
  (state, props) => ({
    sidebar: state.sidebar,
    isDetailsTabOpen: isDetailsTabOpen(state, props.folder.id),
    hasNotifications: getUnseenNotifications(state, props.folder.id, 'folder').length > 0,
    shares: selectSharedCount(state, 'folder', props.folder.id),
    locked: state.teams.active.locked
  }),
  (dispatch, props) => ({
    toggleDetails: () => dispatch(toggleDetails(props.folder.id, 'folder')),
    markAsSeen: () => dispatch(markAsSeen(props.folder.id, 'folder'))
  })
)(FolderRow);

const TableRowStyle = css`
  min-height: 57px;
  .btn-actions-handler {
    > div {
      pointer-events: none;
    }
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

const FolderThumbHanler = styled('div')`
  position: relative;

  .btn-select {
    position: absolute;
    left: -48px;
    top: 8px;
  }

  .thumb-svg {
    height: 32px;
  }

  .folder-shared {
    .folder-shared {
      display: initial !important;
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
