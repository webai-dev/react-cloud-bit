import React, { Component } from 'react';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { markAsSeen } from 'state/notifications/_actions';
import { toggleDetails } from 'components/layouts/sidebar/right/_actions';
import { supportsFullscreen } from './_selectors';
import { getUnseenNotifications } from 'state/notifications/_selectors';
import { selectSharedCount } from 'state/sharedUsers';
import { fetchFolders } from 'views/folders/_actions';
import { isDetailsTabOpen } from 'components/layouts/sidebar/right/_selectors';

import styled from 'react-emotion';
import SvgRender from 'components/general/SvgRender';
import {
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip
} from 'reactstrap';

import { withRouter } from 'react-router-dom';
import info from 'assets/svg/general/info.svg';

import ColorPalette from 'components/general/ColorPalette';
import ButtonIcon from 'components/general/ButtonIcon';
import Copy from 'components/copy';

import { minWidth } from 'utils/media';
import variables from 'assets/sass/partials/_exports.scss';

import bullets from 'assets/svg/general/bullets.svg';
import dashboard from 'assets/svg/general/dashboard.svg';
import fullscreen from 'assets/svg/actions/fullscreen.svg';
import pp from 'assets/svg/general/shared-pp.svg';
import sharedShortcut from 'assets/svg/general/shared_shortcut.svg';

import BitFrame from './BitFrame';

class Bit extends Component {
  _mounted = false;

  constructor(props) {
    super(props);

    this.state = {
      url: null,
      token: null,
      tags: [],
      sandbox: window.Modernizr && window.Modernizr.sandbox ? true : false,
      edit: false,
      dropdownOpen: false
    };
  }

  click(e, type, bit) {
    this.props.action(e, type, bit);
  }

  selectBit(e, bit) {
    this.props.selectBit({
      bit_id: bit.id,
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey || e.metaKey
    });
  }

  componentDidMount() {
    this._mounted = true;

    const bitId = this.props.bit.id;
    const teamId = this.props.active_team.id;

    if (teamId && this.state.sandbox && !this.props.teamIsLocked) {
      this.props.fetchBit({ bit_id: bitId, team_id: teamId }).then(data => {
        if (data && this._mounted) {
          this.setState({ url: data.url, token: data.token, tags: data.tags });
        }
      });

      this.props.fetchFolders({
        team_id: teamId,
        folder_id: this.props.bit.folder_id
      });
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  isShortcut() {
    const { bit } = this.props;
    return bit.is_shortcut || bit.shortcut_id;
  }

  getBackgroundColor = () => {
    if (this.props.isDetailsTabOpen) return variables.rowSelected;
    else if (this.props.selected.indexOf(this.props.bit.id) !== -1) return variables.selected;
    else return 'initial';
  };

  render() {
    const { url, token, tags } = this.state;
    const { bit, inShares, hasNotifications, shares, supportsFullscreen } = this.props;
    const locked = this.props.active_team.locked;

    return (
      <Frame
        onClick={() => hasNotifications && this.props.markAsSeen()}
        className={`bit-wrapper ${this.props.className}${
          this.props.selected.indexOf(bit.id) !== -1 ? ' selected' : ''
        }${this.isShortcut() && !inShares ? ' shortcut-icon-large' : ''}`}
      >
        <div className="bit-inner d-flex flex-column">
          {bit.color && <BitColor color={bit.color} />}
          <Title small={!!bit.color} className="d-flex justify-content-between align-items-start">
            <span className="title text-truncate">{bit.title}</span>
            <div className="actions">
              <div className="d-flex align-items-center">
                <SharedCount>
                  {(this.props.inShares || this.props.active_folder) && (
                    <button
                      type="button"
                      className={`btn btn-select ${
                        this.props.selected.indexOf(bit.id) !== -1 ? 'active' : ''
                      }`}
                      onClick={e => this.selectBit(e, bit)}
                    />
                  )}
                  {shares.count > 1 ? (
                    <button
                      type="button"
                      className={`btn btn-empty btn-smaller d-flex align-items-center justify-content-center p-0 ml-2 ${
                        !shares.hasIndividualShares ? 'text-icon-inactive' : ''
                      }`}
                      onClick={e => this.click(e, 'shareBit', bit)}
                      disabled={locked}
                    >
                      <SvgRender style={{ height: 14 }} path={pp} />
                      <span className="pl-1">{shares.count}</span>
                    </button>
                  ) : null}
                </SharedCount>
                <UncontrolledDropdown
                  className="ml-2 mr-2"
                  isOpen={this.state.dropdownOpen}
                  toggle={e =>
                    this.setState(prevState => ({
                      dropdownOpen: !prevState.dropdownOpen,
                      edit: false
                    }))
                  }
                >
                  <DropdownToggle className={`btn-dropdown btn-empty btn-smaller btn-small-border`}>
                    <SvgRender style={{ height: 16 }} path={bullets} />
                  </DropdownToggle>
                  <DropdownMenu right className={this.state.edit ? 'settings-open' : ''}>
                    <DropdownMenuGroup
                      className={`actions-group ${!this.state.edit ? ' active' : ''}`}
                    >
                      <DropdownItem
                        tag="div"
                        className="btn dropdown-item btn-dropdown-icon btn-edit-icon"
                        onClick={e =>
                          this.props.history.push(
                            `/bit/${bit.id}/edit${bit.folder_id ? '?folder=' + bit.folder_id : ''}`
                          )
                        }
                        disabled={locked}
                      >
                        <ButtonIcon icon="edit">Edit</ButtonIcon>
                      </DropdownItem>
                      {this.props.inShares && !this.isShortcut() ? (
                        <DropdownItem
                          tag="div"
                          className="btn dropdown-item btn-dropdown-icon btn-shortcut-icon"
                          onClick={e => this.click(e, 'createShortcutBit', bit)}
                          disabled={locked}
                        >
                          <ButtonIcon icon="shortcut">Create shortcut</ButtonIcon>
                        </DropdownItem>
                      ) : (
                        <DropdownItem
                          tag="div"
                          className="btn dropdown-item btn-dropdown-icon btn-move-icon"
                          onClick={e => this.click(e, 'moveBit', bit)}
                          disabled={locked}
                        >
                          <ButtonIcon icon="move">Move</ButtonIcon>
                        </DropdownItem>
                      )}
                      <DropdownItem
                        tag="div"
                        className="btn dropdown-item btn-dropdown-icon btn-share-icon"
                        onClick={e => this.click(e, 'shareBit', bit)}
                        disabled={locked}
                      >
                        <ButtonIcon icon="share">Share</ButtonIcon>
                      </DropdownItem>
                      <DropdownItem
                        tag="div"
                        className="btn dropdown-item btn-dropdown-icon btn-change-icon btn-arrow-back-icon"
                        toggle={false}
                        onClick={e => this.setState({ edit: true })}
                        disabled={locked}
                      >
                        <ButtonIcon icon="color">Choose color</ButtonIcon>
                      </DropdownItem>
                      <DropdownItem
                        tag="div"
                        className="btn dropdown-item btn-dropdown-icon btn-delete-icon"
                        onClick={e => this.click(e, 'deleteBit', bit)}
                      >
                        <ButtonIcon icon="delete">
                          {this.props.inShares
                            ? 'Remove from Shared'
                            : bit.is_shortcut
                            ? 'Remove Shortcut'
                            : 'Delete'}
                        </ButtonIcon>
                      </DropdownItem>
                    </DropdownMenuGroup>

                    <DropdownMenuGroup
                      className={`settings-group position-absolute w-100 d-flex flex-column h-100 ${
                        this.state.edit ? ' active' : ''
                      }`}
                    >
                      <button
                        type="button"
                        className="btn dropdown-item btn-dropdown-icon btn-arrow-back-icon"
                        onClick={e => this.setState({ edit: false })}
                      >
                        Back
                      </button>
                      <Row className="no-gutters">
                        <Col>
                          <PreviewLine color={bit.color ? variables[`bitColor${bit.color}`] : ''} />
                        </Col>
                        <Col xs="auto">
                          <div className="pr-4 pt-1">
                            <ColorPalette
                              selected={bit.color}
                              onChange={color =>
                                this.props.editBit({
                                  team_id: this.props.active_team.id,
                                  tags,
                                  color,
                                  id: bit.id
                                })
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    </DropdownMenuGroup>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
          </Title>
          <BitFrame
            bit={bit}
            url={url}
            token={token}
            sandbox={this.state.sandbox}
            locked={locked}
          />
          <Bottom className="d-flex align-items-center justify-content-end mt-auto py-1 px-3">
            {hasNotifications && <Bullet />}
            <div className="mr-auto">
              {tags.length ? (
                <Tags>
                  {tags.map((x, id) => {
                    return <Tag key={`tag-${id}`}>#{x}</Tag>;
                  })}
                </Tags>
              ) : null}
            </div>
            <button
              className={`btn d-flex align-items-center btn-empty p-0 ml-1 ${
                !inShares ? 'mr-1' : ''
              }`}
              onClick={this.props.toggleDetails}
              disabled={locked}
              id={`bit-detail-${bit.id}`}
            >
              <SvgRender style={{ height: 20 }} className={`info-icon `} path={info} />

              <UncontrolledTooltip
                placement="top"
                delay={{ show: 100 }}
                target={`bit-detail-${bit.id}`}
              >
                View details
              </UncontrolledTooltip>
            </button>
            {this.props.inShares && (
              <button
                className={`btn d-flex align-items-center btn-empty p-0 ml-1 mr-1 ${
                  this.isShortcut() ? 'active' : ''
                }`}
                onClick={e =>
                  this.isShortcut()
                    ? this.click(e, 'deleteShortcutBit', bit)
                    : this.click(e, 'createShortcutBit', bit)
                }
                disabled={locked}
              >
                <SvgRender
                  style={{ height: 16 }}
                  className="shared-shortcut"
                  path={sharedShortcut}
                />
              </button>
            )}

            <Copy id={bit.id} tooltip={true} type="bit" />

            {supportsFullscreen && !locked && (
              <a
                className="btn d-flex align-items-center btn-empty p-0 ml-1"
                href={`/bit/${this.props.bit.id}/full`}
                target="_blank"
                id={`view-full-${bit.id}`}
              >
                <SvgRender style={{ height: 16 }} className="fullscreen-icon" path={fullscreen} />
                <UncontrolledTooltip placement="top" target={`view-full-${bit.id}`}>
                  View full screen
                </UncontrolledTooltip>
              </a>
            )}
            <button
              className={`btn d-flex align-items-center btn-empty p-0 ml-1 ${
                bit.is_locked ? 'active' : ''
              }`}
              onClick={e => this.props.lock(e, bit)}
              disabled={locked}
              id={`add-to-${bit.id}`}
            >
              <SvgRender style={{ height: 16 }} className="lock-icon" path={dashboard} />
            </button>
          </Bottom>
        </div>

        <UncontrolledTooltip placement="top" target={`add-to-${bit.id}`}>
          Add to dashboard
        </UncontrolledTooltip>
      </Frame>
    );
  }
}

export default compose(
  withRouter,
  connect(
    (state, props) => ({
      isDetailsTabOpen: isDetailsTabOpen(state, props.bit.id),
      hasNotifications: getUnseenNotifications(state, props.bit.id, 'bit').length > 0,
      shares: selectSharedCount(state, 'bit', props.bit.id),
      supportsFullscreen: supportsFullscreen(state, props.bit.id),
      teamIsLocked: state.teams.active.locked,
      active_team: state.teams.active
    }),
    (dispatch, props) => ({
      toggleDetails: () => dispatch(toggleDetails(props.bit.id, 'bit')),
      markAsSeen: () => dispatch(markAsSeen(props.bit.id, 'bit')),
      fetchFolders: params => dispatch(fetchFolders(params))
    })
  )
)(Bit);

const Frame = styled('div')`
  > .bit-inner {
    height: 100%;
    background: #fff;
    border: 1px solid ${variables.linesGray};
    border-radius: 3px;
  }

  &:hover > .bit-inner,
  &.selected > .bit-inner {
    box-shadow: 0px 4px 10px 0px ${variables.linesGray};
  }

  .dropdown-menu {
    overflow: hidden;
    transition: padding 200ms ease;

    &.settings-open {
      padding: 0 0 ${variables.size40} 0;
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

const Title = styled('div')`
  position: relative;
  width: 100%;
  color: ${variables.head};
  border-bottom: 1px solid ${variables.linesGray};
  height: 40px;
  margin-top: ${({ small }) => (small ? 4 : 8)}px;

  .btn-share {
    display: none;
  }

  &:hover {
    .btn-share {
      display: block;
    }
  }

  .title {
    font-size: ${variables.size14};
    padding: 0 ${variables.size8};
    position: relative;
    bottom: -${variables.size24};
    left: ${variables.size16};
    background: #fff;
    font-weight: 500;
    max-width: calc(100% - 80px);

    ${minWidth.xl + `{  font-size: ${variables.size16};}`};
    ${minWidth.hd + `{  font-size: ${variables.size20};}`};
  }
`;

const Bottom = styled('div')`
  max-height: ${variables.bitFooter};
  min-height: ${variables.bitFooter};
`;

const Tags = styled('div')`
  height: 16px;
  overflow: hidden;
`;

const Tag = styled('div')`
  color: ${variables.primary};
  font-size: ${variables.size12};
  font-weight: 400;
  margin: 0 ${variables.size24} 0 0;
  text-transform: uppercase;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 16px;
  max-width: 100%;
`;

const SharedCount = styled('div')`
  font-size: ${variables.size14};
  height: 32px;
  display: flex;
  align-items: center;
  border-right: 1px solid ${variables.linesGray};
  padding-right: ${variables.size16};
`;

const PreviewLine = styled('div')`
  width: ${variables.size12};
  height: 100%;
  background: ${props => (props.color ? props.color : '')};
  margin: 0 auto;
`;

const DropdownMenuGroup = styled('div')`
  will-change: transform, opacity;
  transition-property: transform, opacity;
  transition-duration: 0.25s;
  opacity: 0;

  &.actions-group {
    transform: translateX(-302px);
  }

  &.settings-group {
    top: 0;
    left: 0;
    transform: translateX(302px);

    .btn-arrow-back-icon {
      border-bottom: 1px solid ${variables.gray0};
    }

    > .row {
      flex: 1;
    }
  }

  &.active {
    transform: translateX(0);
    opacity: 1;
  }
`;

const BitColor = styled('div')`
  height: 4px;
  background-color: ${({ color }) => variables[`bitColor${color}`]}
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

const Bullet = styled('div')`
  width: ${variables.size8};
  height: ${variables.size8};
  border-radius: 50%;
  background: ${variables.iconFlagged};
  margin-right: ${variables.size16};
`;
