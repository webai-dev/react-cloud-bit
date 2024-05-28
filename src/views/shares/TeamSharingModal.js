import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import SvgRender from 'components/general/SvgRender';
import { Formik, Form } from 'formik';
import Yup from 'yup';
import Select from 'react-select';
import styled, { css } from 'react-emotion';
import { UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import ButtonIcon from 'components/general/ButtonIcon';

import { errorHandler } from 'utils/alerts';

import variables from 'assets/sass/partials/_exports.scss';

import view from 'assets/svg/actions/show.svg';
import edit from 'assets/svg/actions/edit.svg';
import share from 'assets/svg/actions/share.svg';

import loader from 'assets/svg/general/loader.svg';

import SharesUsers from './SharesUsers';
import SharesTeam from './SharesTeam';

class TeamSharingModal extends Component {
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
      loading: true,
      team_shared: false,
      is_submitting: false,
      team_members_count: 0
    };

    this.getOptions = this.getOptions.bind(this);
    this.shareWithTeam = this.shareWithTeam.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onPemChange = this.onPemChange.bind(this);
    this.fetchSharePermissions = this.fetchSharePermissions.bind(this);
  }

  onFieldChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  onPemChange(e, field, value) {
    e.preventDefault();
    this.onFieldChange(field, value);
  }

  flipSharingMode = () => {
    this.setState(prevState => ({ shareMode: prevState.shareMode == 'team' ? 'link' : 'team' }));
  };

  getOptions(input) {
    return this.props
      .fetchTeamMembers({ team_id: this.props.active_team.id, search: input })
      .then(response => {
        let options = {};
        options.cache = true;

        if (response && input !== '') {
          options.options = response
            // .filter(x => {
            //   let user = this.props.share_users.find(u => u.user_id === x.id);

            //   return x.id !== this.props.user.id && !user;
            // })
            .map(x => {
              return { value: x.id, label: x.email };
            });
        }
        return options;
      })
      .catch(this.props.errorHandler);
  }

  handleShareResponse(data) {
    if (this.props.onShareChange) this.props.onShareChange(data.shares || []);
    this.fetchSharePermissions();
    this.setState({ users: [] });
  }

  shareWithTeam = permissions => () => {
    this.setState({ is_submitting: true });
    let params = { team_id: this.props.active_team.id };

    switch (permissions) {
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

    params.shareable_id = this.props.item.id;
    params.shareable_type = this.props.shareable_type;

    this.props.createShare(params).then(data => {
      if (data) {
        this.handleShareResponse(data);
      }

      this.setState({ is_submitting: false });
    });
  };

  unshareWithTeam = () => {
    this.setState({ is_submitting: true });
    let params = {
      team_id: this.props.active_team.id,
      shareable_id: this.props.item.id,
      shareable_type: this.props.shareable_type
    };

    this.props.unshareWithTeam(params).then(data => {
      if (data) {
        this.handleShareResponse(data);
      }

      this.setState({ is_submitting: false });
    });
  };

  fetchSharePermissions() {
    this.setState({ loading: true });
    this.props
      .fetchSharePermissions({
        shareable_id: this.props.item.id,
        shareable_type: this.props.shareable_type
      })
      .then(data => {
        this.setState({ loading: false, team_shared: data.team_shared });
      })
      .catch(this.props.errorHandler);
  }

  componentDidMount() {
    if (this.props.bulk !== true) this.fetchSharePermissions();
    else this.setState({ loading: false });

    this.props
      .fetchTeamMembers({ team_id: this.props.active_team.id })
      .then(data => this.setState({ team_members_count: data.length }));
  }

  userCanShare = () => {
    return this.props.userPem === 'share' || this.props.userPem === 'owner';
  };

  getSharesCount = shares => {
    //filter out shares for the same user
    const filteredShares = shares.reduce(
      (filtered, share) =>
        !filtered.find(s => s.user_id === share.user_id) ? [...filtered, share] : filtered,
      []
    );

    // + 1 for the owner if not present
    return filteredShares.find(share => share.user_id === this.props.share_owner.id)
      ? filteredShares.length
      : filteredShares.length + 1;
  };

  render() {
    return (
      <Fragment>
        <div className="pl-4 pr-4">
          {this.props.bulk !== true && (
            <Fragment>
              {(this.props.userPem === 'owner' || this.props.userPem === 'share') && (
                <div>
                  {this.state.team_shared ? (
                    <AccessLabel className="pb-2 mb-2">{` Shared with Team  (${this.getSharesCount(
                      this.props.share_users
                    )}/${this.state.team_members_count})`}</AccessLabel>
                  ) : (
                    <AccessLabel className="pb-2 mb-2">Invite Team</AccessLabel>
                  )}
                  <SharesTeam
                    team_shared={this.state.team_shared}
                    share_owner={this.props.share_owner}
                    userPem={this.props.userPem}
                    user={this.props.user}
                    editShare={this.props.editShare}
                    deleteShare={this.props.deleteShare}
                    toggle={this.props.toggle}
                    active_folder={this.props.active_folder}
                    team={this.props.active_team}
                    history={this.props.history}
                    shareable_type={this.props.shareable_type}
                    shareWithTeam={this.shareWithTeam}
                    unshareWithTeam={this.unshareWithTeam}
                    is_submitting={this.state.is_submitting}
                  />
                  <hr />
                </div>
              )}
              <AccessLabel className="pb-2 mb-2 mt-4">Who has permissions</AccessLabel>
              {!this.state.loading ? (
                <SharesUsers
                  item_id={this.props.item.id}
                  share_owner={this.props.share_owner}
                  share_creator={this.props.share_creator}
                  share_users={this.props.share_users}
                  userPem={this.props.userPem}
                  user={this.props.user}
                  editShare={this.props.editShare}
                  deleteShare={this.props.deleteShare}
                  onShareChange={this.props.onShareChange}
                  toggle={this.props.toggle}
                  active_folder={this.props.active_folder}
                  active_team={this.props.active_team}
                  history={this.props.history}
                  team_shared={this.state.team_shared}
                />
              ) : (
                <SvgRender
                  style={{ height: 90 }}
                  className="icon"
                  wrapperClassName={SharesLoader}
                  path={loader}
                />
              )}
            </Fragment>
          )}

          <Formik
            initialValues={{}}
            validationSchema={Yup.object().shape({})}
            onSubmit={(values, { setSubmitting }) => {
              let params = { team_id: this.props.active_team.id };

              switch (this.state.permissions) {
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

              params.users = this.state.users.map(u => {
                return u.value;
              });

              if (this.props.bulk === true) {
                const selected_folders = this.props.selected_folders.map(f => {
                  return { shareable_id: f, shareable_type: 'folder' };
                });
                const selected_bits = this.props.selected_bits.map(b => {
                  return { shareable_id: b, shareable_type: 'bit' };
                });
                const selected_files = this.props.selected_files.map(f => {
                  return { shareable_id: f, shareable_type: 'file' };
                });
                params.items = [...selected_folders, ...selected_bits, ...selected_files];

                this.props.createBulkShare(params).then(data => {
                  if (data) {
                    this.setState({ users: [] });
                  }
                  setSubmitting(false);
                });
              } else {
                params.shareable_id = this.props.item.id;
                params.shareable_type = this.props.shareable_type;

                this.props.createShare(params).then(data => {
                  if (data) {
                    if (this.props.onShareChange) this.props.onShareChange(data.shares);
                    this.fetchSharePermissions();
                    this.setState({ users: [] });
                  }
                  setSubmitting(false);
                });
              }
            }}
            render={({ setFieldValue, handleChange, values, touched, errors, isSubmitting }) => (
              <Form>
                {this.props.userPem === 'share' ||
                this.props.userPem === 'owner' ||
                this.props.bulk === true ? (
                  <div
                    className={`row pt-2 mr-0 ml-0 ${this.props.bulk !== true ? BorderTop : ''}`}
                  >
                    <div className="col pl-0 pr-0">
                      <Select.Async
                        multi={this.state.multi}
                        value={this.state.users}
                        onChange={a => this.onFieldChange('users', a)}
                        loadOptions={this.getOptions}
                        autoload={false}
                        required={true}
                        cache={false}
                        placeholder="Enter email addresses"
                        name="users"
                      />
                    </div>
                    <DropdownWrapper>
                      <UncontrolledDropdown className={DropdownStyle}>
                        <DropdownToggle
                          className={`btn-dropdown btn-block btn-border btn-smaller pr-2 pl-2 `}
                          type="button"
                        >
                          <SvgRender
                            style={{ height: 16 }}
                            path={
                              this.state.permissions === 'view'
                                ? view
                                : this.state.permissions === 'edit'
                                ? edit
                                : share
                            }
                          />
                        </DropdownToggle>
                        <DropdownMenu className="mt-2 mb-2" right>
                          <DropdownItem
                            className="btn dropdown-item btn-dropdown-icon btn-view-icon"
                            onClick={e => this.onPemChange(e, 'permissions', 'view')}
                          >
                            <ButtonIcon icon="show">View</ButtonIcon>
                          </DropdownItem>
                          <DropdownItem
                            className="btn dropdown-item btn-dropdown-icon btn-edit-icon"
                            onClick={e => this.onPemChange(e, 'permissions', 'edit')}
                          >
                            <ButtonIcon icon="edit">Edit</ButtonIcon>
                          </DropdownItem>
                          <DropdownItem
                            className="btn dropdown-item btn-dropdown-icon btn-share-icon border-0"
                            onClick={e => this.onPemChange(e, 'permissions', 'share')}
                          >
                            <ButtonIcon icon="share">Share</ButtonIcon>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </DropdownWrapper>
                    <div className="mb-3 col-12 d-flex align-items-center justify-content-end pr-0 text-right mt-3">
                      {(this.props.userPem === 'share' ||
                        this.props.userPem === 'owner' ||
                        this.props.bulk === true) && (
                        <button
                          type="submit"
                          className="btn btn-success pr-2 pl-2"
                          disabled={
                            (this.state.users.length === 0 && this.props.bulk !== true) ||
                            isSubmitting
                          }
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-8" />
                )}
              </Form>
            )}
          />
        </div>
        {this.props.bulk !== true && this.props.shareable_type === 'file' && this.userCanShare() && (
          <ShareLinkFooter className="d-flex justify-content-between col-12 pl-4 pr-4 pt-1 pb-1">
            <div className="pl-0">Or share this file via a public link</div>
            <div className="pr-0">
              <u className={ShareLink} onClick={this.props.changeSharingMode}>
                Link settings
              </u>
            </div>
          </ShareLinkFooter>
        )}
      </Fragment>
    );
  }
}

export default connect(
  null,
  dispatch => ({ errorHandler: message => errorHandler(dispatch, message) })
)(TeamSharingModal);

const AccessLabel = styled('div')`
  font-size: ${variables.size18};
  font-weight: bold;
`;

const ShareLinkFooter = styled('div')`
  color: #fff;
  background-color: #8492a6;
  border-radius: 0 0 3px 3px;
  border: none;

  margin-bottom: -1rem;
`;

const ShareLink = css`
  cursor: pointer;
`;

const BorderTop = css`
  border-top: 1px solid ${variables.linesGray};
`;

const SharesLoader = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .icon * {
    fill: ${variables.darkBlue};
  }
`;

const DropdownWrapper = styled('div')`
  width: 57px;
  dissplay: flex;
  padding-left: ${variables.size8};
`;

const DropdownStyle = css`
  &.show {
    .btn-dropdown {
      border-color: ${variables.primary};
    }
  }
  width: 49px;
`;
