import React, { Component, Fragment } from 'react';
import SvgRender from 'components/general/SvgRender';
import styled, { css } from 'react-emotion';

import { TableAvatar } from 'components/table';
import { Scrollbar } from 'utils/styles/scrollbar';
import ButtonIcon from 'components/general/ButtonIcon';

import variables from 'assets/sass/partials/_exports.scss';

import deleteSvg from 'assets/svg/actions/delete.svg';
import view from 'assets/svg/actions/show.svg';
import edit from 'assets/svg/actions/edit.svg';
import share from 'assets/svg/actions/share.svg';
import { UncontrolledTooltip } from 'reactstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import Breadcrumbs from './Breadcrumbs';

class SharesUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      multi: true,
      users: [],
      permissions: 'view',
      userPermissions: {},
      permissionsList: [
        { value: 'view', label: 'View' },
        { value: 'edit', label: 'Edit' },
        { value: 'share', label: 'Share' }
      ],
      popup: { position: { top: 0, left: 0 }, user: {} },
      dropdownsOpen: {}
    };

    this.onPemChange = this.onPemChange.bind(this);
    this.togglePermissions = this.togglePermissions.bind(this);
  }

  onPemChange = (e, value, share) => {
    let params = { id: share.id };
    switch (value) {
      case 'edit':
        params.edit = 1;
        params.share = 0;
        break;

      case 'share':
        params.edit = 1;
        params.share = 1;
        break;

      default:
        params.edit = 0;
        params.share = 0;
    }

    this.props.editShare(params);
    this.setState({ dropdownsOpen: {} });
  };

  onDeleteShare = (e, share) => {
    let params = { id: share.id, user_id: this.props.user.id };
    this.props.deleteShare(params).then(data => {
      if (this.props.onShareChange)
        this.props.onShareChange(
          this.props.share_users.filter(share => share.user_id !== data.user_id)
        );
      if (data && params.user_id === data.user_id) {
        if (data.shareable_type === 'folder' && data.shareable_id == this.props.active_folder) {
          this.props.history.push(`/`);
        }
        this.props.toggle();
      }
    });
  };

  togglePermissions(i) {
    let dropdowns = Object.assign({}, this.state.dropdownsOpen);
    let newDropdowns = {};

    if (!dropdowns[i]) {
      dropdowns[i] = true;
      newDropdowns[i] = dropdowns[i];
    }

    this.setState({ dropdownsOpen: newDropdowns });
  }

  permValue = perm => {
    switch (perm) {
      case 'view':
        return 1;
      case 'edit':
        return 2;
      case 'share':
      default:
        return 3;
    }
  };

  keepOnlyDistinctPermitions = shares =>
    shares.reduce((distinctShares, share) => {
      const presentShare = distinctShares.find(s => s.user_id === share.user_id);

      // user not in shares
      if (!presentShare) {
        // push share;
        return [...distinctShares, share];
      }
      // user exists but with lower permissions
      else if (this.permValue(presentShare.permission) < this.permValue(share.permission)) {
        // replace share
        return [...distinctShares.filter(s => s.user_id !== share.user_id), share];
      } else {
        //do nothing
        return distinctShares;
      }
    }, []);

  render() {
    const shares = this.keepOnlyDistinctPermitions(this.props.share_users);

    const creatorShare =
      this.props.share_creator &&
      this.props.share_creator.id &&
      shares.find(s => s.user_id === this.props.share_creator.id);

    const sharesWithoutCreator = creatorShare
      ? shares.filter(s => s.id !== creatorShare.id)
      : shares;

    const directShareUsers = sharesWithoutCreator.filter(
      share => share.shareable_id === this.props.item_id
    );
    const indirectShareUsers = sharesWithoutCreator.filter(
      share => share.shareable_id !== this.props.item_id
    );

    return (
      <SharesWrapper className={Scrollbar}>
        {this.props.share_owner && this.props.share_owner.name && (
          <div className="d-flex mb-2 align-items-center">
            <UserAvatarWrap>
              <TableAvatar
                image={this.props.share_owner.photo}
                name={this.props.share_owner.name}
              />
            </UserAvatarWrap>
            <div className="col-8 text-truncate">
              <Name user={this.props.share_owner} /> <br />
            </div>
            <div className="col-2 text-center main-text semibold">Owner</div>
          </div>
        )}
        {this.props.share_owner.id !== this.props.share_creator.id && creatorShare && (
          <div className="d-flex mb-2 align-items-center">
            <UserAvatarWrap>
              <TableAvatar image={creatorShare.photo} name={creatorShare.name} />
            </UserAvatarWrap>
            <div className="col-6 text-truncate">
              <Name user={creatorShare} /> <br />
            </div>
            <div className="col-2 pl-2 pr-2">
              <PermissionsDropdown
                {...this.props}
                current={creatorShare}
                onPemChange={this.onPemChange}
              />
            </div>
            <div className="col-2 text-rigt main-text semibold">Creator</div>
          </div>
        )}
        {directShareUsers.length > 0 && <Divider />}
        {directShareUsers.map((s, i) => {
          return (
            <div className="d-flex mb-2 align-items-center" key={i}>
              <UserAvatarWrap>
                <TableAvatar image={s.photo} name={s.name} />
              </UserAvatarWrap>
              <div className="col-8 text-truncate">
                <Name user={s} />
                <br />
                <small className="mr-1">on:</small>
                <small className="text-secondary"> this item</small>
              </div>

              <div className="col-2 pl-2 pr-2">
                <PermissionsDropdown {...this.props} current={s} onPemChange={this.onPemChange} />
              </div>
              <div className="col-1 pl-0 pr-1">
                {(s.user_id === this.props.user.id ||
                  this.props.userPem === 'share' ||
                  this.props.userPem === 'owner') &&
                !this.props.team_shared ? (
                  <div
                    className="btn d-flex align-items-center btn-empty p-0 btn-small-share"
                    onClick={e => this.onDeleteShare(e, s)}
                  >
                    <SvgRender style={{ height: 16 }} path={deleteSvg} />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {indirectShareUsers.length > 0 && <Divider />}
        {indirectShareUsers.map((s, i) => {
          return (
            <div className="d-flex mb-2 align-items-center" key={i}>
              <UserAvatarWrap>
                <TableAvatar image={s.photo} name={s.name} />
              </UserAvatarWrap>
              <div className="col-8 text-truncate">
                <Name user={s} /> <br />
                <Breadcrumbs folderId={s.shareable_id} />
              </div>
              <div className="col-2 pl-2 pr-2">
                <div className="d-flex aling-items-center justify-content-center ">
                  <SvgRender
                    style={{ height: 16 }}
                    path={s.permission === 'view' ? view : s.permission === 'edit' ? edit : share}
                  />
                </div>
              </div>
              <div className="col-1 pl-0 pr-1" />
            </div>
          );
        })}
      </SharesWrapper>
    );
  }
}

export default SharesUsers;

const Name = ({ user }) => (
  <Fragment>
    <span id={`share-user-${user.id}`}>{user.name}</span>
    <UncontrolledTooltip
      placement="top"
      target={`share-user-${user.id}`}
      innerClassName={TooltipStyle}
      className={css`
        opacity: 1 !important;
      `}
    >
      {user.email}
    </UncontrolledTooltip>
  </Fragment>
);

const PermissionsDropdown = ({ user, userPem, current, onPemChange }) => (
  <UncontrolledDropdown
    disabled={
      (current.user_id !== user.id && userPem === 'share') || userPem === 'owner' ? false : true
    }
    className={DropdownStyle}
  >
    <DropdownToggle
      className={`btn-dropdown btn-block btn-border btn-smaller pr-2 pl-2 `}
      disabled={
        (current.user_id !== user.id && userPem === 'share') || userPem === 'owner' ? false : true
      }
    >
      <SvgRender
        style={{ height: 16 }}
        path={current.permission === 'view' ? view : current.permission === 'edit' ? edit : share}
      />
    </DropdownToggle>
    <DropdownMenu right>
      <DropdownItem
        className="btn dropdown-item btn-dropdown-icon btn-view-icon"
        onClick={e => onPemChange(e, 'view', current)}
      >
        <ButtonIcon icon="show">View</ButtonIcon>
      </DropdownItem>
      <DropdownItem
        className="btn dropdown-item btn-dropdown-icon btn-edit-icon"
        onClick={e => onPemChange(e, 'edit', current)}
      >
        <ButtonIcon icon="edit">Edit</ButtonIcon>
      </DropdownItem>
      <DropdownItem
        className="btn dropdown-item btn-dropdown-icon btn-share-icon border-0"
        onClick={e => onPemChange(e, 'share', current)}
      >
        <ButtonIcon icon="share">Share</ButtonIcon>
      </DropdownItem>
    </DropdownMenu>
  </UncontrolledDropdown>
);

const SharesWrapper = styled('div')`
  height: 216px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
`;

const UserAvatarWrap = styled('div')`
  .avatar-wrapper {
    div,
    img {
      width: 40px;
      height: 40px;
    }

    + div {
      padding-left: ${variables.size24};
    }
  }
`;

const DropdownStyle = css`
  &.show {
    .btn-dropdown {
      border-color: ${variables.primary};
    }
  }
`;

const Divider = styled('div')`
  border-bottom: 1px solid ${variables.linesGray};
  margin-bottom: ${variables.size16};
`;

const TooltipStyle = css`
  font-size: ${variables.size12};

  background-color: ${variables.head};
  color: white;
  box-shadow: 4px 6px 32px -3px #9e9e9e;

  + .arrow:before {
    border-top-color: ${variables.head};
    border-bottom-color: ${variables.head};
  }
`;
