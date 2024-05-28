import variables from 'assets/sass/partials/_exports.scss';
import edit from 'assets/svg/actions/edit.svg';
import share from 'assets/svg/actions/share.svg';
import view from 'assets/svg/actions/show.svg';
import ButtonIcon from 'components/general/ButtonIcon';
import SvgRender from 'components/general/SvgRender';
import { TableAvatar } from 'components/table';
import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Label,
  UncontrolledDropdown
} from 'reactstrap';

class SharesTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      permissions: 'view',
      permissionsList: [
        { value: 'view', label: 'View' },
        { value: 'edit', label: 'Edit' },
        { value: 'share', label: 'Share' }
      ]
    };

    this.onPemChange = this.onPemChange.bind(this);
  }

  onPemChange = (e, value) => {
    e.preventDefault();
    this.setState({ permissions: value });
  };

  render() {
    const { team, userPem, team_shared, shareable_type } = this.props;
    const { permissions } = this.state;

    return team_shared == false ? (
      <SharesWrapper>
        <div className="d-flex mb-1 align-items-center">
          <AvatarWrap>
            <TableAvatar image={team.photo} name={team.name} />
          </AvatarWrap>
          <div className="col-5 text-truncate">{team.name}</div>
          <DropdownWrapper>
            <UncontrolledDropdown
              disabled={
                this.props.is_submitting
                  ? true
                  : userPem === 'share' || userPem === 'owner'
                  ? false
                  : true
              }
              className={DropdownStyle}
            >
              <DropdownToggle
                className={`btn-dropdown btn-block btn-border btn-smaller pr-2 pl-2 `}
                disabled={
                  this.props.is_submitting
                    ? true
                    : userPem === 'share' || userPem === 'owner'
                    ? false
                    : true
                }
              >
                <SvgRender
                  style={{ height: 16 }}
                  path={permissions === 'view' ? view : permissions === 'edit' ? edit : share}
                />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  className="btn dropdown-item btn-dropdown-icon btn-view-icon"
                  onClick={e => this.onPemChange(e, 'view')}
                >
                  <ButtonIcon icon="show">View</ButtonIcon>
                </DropdownItem>
                <DropdownItem
                  className="btn dropdown-item btn-dropdown-icon btn-edit-icon"
                  onClick={e => this.onPemChange(e, 'edit')}
                >
                  <ButtonIcon icon="edit">Edit</ButtonIcon>
                </DropdownItem>
                <DropdownItem
                  className="btn dropdown-item btn-dropdown-icon btn-share-icon border-0"
                  onClick={e => this.onPemChange(e, 'share')}
                >
                  <ButtonIcon icon="share">Share</ButtonIcon>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </DropdownWrapper>
          <div className="col-3 pl-0 pr-1">
            <button
              type="button"
              className={'btn btn-primary btn-smaller d-flex align-items-center ' + TeamShareButton}
              onClick={this.props.shareWithTeam(permissions)}
              disabled={this.props.is_submitting}
            >
              Share with the whole team
            </button>
          </div>
        </div>
        <div className="d-flex mb-3 align-items-center justify-content-end">
          <Label check className="d-flex align-items-center">
            <small className="secondary-text">
              All team members, except the Guests, will have access to this {shareable_type}
            </small>
          </Label>
        </div>
      </SharesWrapper>
    ) : (
      <SharesWrapper>
        <div className="d-flex mb-1 align-items-center">
          <AvatarWrap>
            <TableAvatar image={team.photo} name={team.name} />
          </AvatarWrap>
          <div className="col-7 text-truncate">{team.name}</div>
          <div className="col-3 pl-0 pr-1">
            <button
              type="button"
              className={'btn btn-danger btn-smaller d-flex align-items-center ' + TeamShareButton}
              onClick={this.props.unshareWithTeam}
              disabled={this.props.is_submitting}
            >
              Unshare with everyone
            </button>
          </div>
        </div>
        <div className="d-flex mb-3 align-items-center justify-content-end">
          <Label check className="d-flex align-items-center">
            <small className="secondary-text">
              {`All your team members will lose access to this ${shareable_type}`}
            </small>
          </Label>
        </div>
      </SharesWrapper>
    );
  }
}

export default SharesTeam;

const SharesWrapper = styled('div')`
  position: relative;
`;

const AvatarWrap = styled('div')`
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

const TeamShareButton = css`
  font-weight: 600;
  color: #fff;
`;

const RadioStyle = css`
  &.form-check-input {
    margin-top: 0.1rem;
    border-color: ${variables.primary};
  }
  border: 1px solid #e0e6ed;
  color: #3c4858;
  background: none !important;
`;

const DropdownWrapper = styled('div')`
  width: 57px;
  dissplay: flex;
`;

const DropdownStyle = css`
  &.show {
    .btn-dropdown {
      border-color: ${variables.primary};
    }
  }
  width: 49px;
`;
