import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { fetchTeamMembers } from 'views/teammates/_actions';
import {
  createShare,
  createBulkShare,
  fetchSharePermissions,
  editShare,
  deleteShare,
  unshareWithTeam
} from './_actions';

import { publishFile } from 'views/files/_actions';

import { getSelectedItems } from 'state/bulk/_helpers';

import TeamSharingModal from './TeamSharingModal';
import LinkSharingModal from './LinkSharingModal';

class SharingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shareMode: 'team'
    };
  }

  flipSharingMode = () => {
    this.setState(prevState => ({ shareMode: prevState.shareMode == 'team' ? 'link' : 'team' }));
  };

  render() {
    return (
      <Fragment>
        <div className="modal-body pl-0 pr-0 pb-0 " id="modal-body">
          {this.state.shareMode == 'team' ? (
            <TeamSharingModal
              {...this.props}
              changeSharingMode={this.flipSharingMode}
              onShareChange={this.props.onShareChange}
            />
          ) : (
            <LinkSharingModal {...this.props} changeSharingMode={this.flipSharingMode} />
          )}
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  let userPem = 'view';
  if (state.user && state.shares.permissions && state.shares.permissions.shares) {
    let u = state.shares.permissions.shares.find(o => o.user_id === state.user.id);

    if (u) {
      if (u.edit && u.share) {
        userPem = 'share';
      } else if (u.edit && !u.share) {
        userPem = 'edit';
      }
    }

    if (state.user.id === state.shares.permissions.owner.id) {
      userPem = 'owner';
    }
  }

  const selected = getSelectedItems(state);

  return {
    user: state.user,
    userPem: userPem,
    active_team: state.teams.active,
    active_clicked: state.folders.click_active,
    active_folder: state.folders.active,
    share_owner: state.shares.permissions.owner,
    share_creator: state.shares.permissions.creator,
    share_users:
      state.shares.permissions && state.shares.permissions.shares
        ? state.shares.permissions.shares.map(x => {
            let pem = 'view';

            if (x.edit && x.share) {
              pem = 'share';
            } else if (x.edit && !x.share) {
              pem = 'edit';
            }

            return { ...x, permission: pem };
          })
        : [],
    selected_bits: selected.selected_bits,
    selected_files: selected.selected_files,
    selected_folders: selected.selected_folders
  };
}

export default connect(
  mapStateToProps,
  {
    fetchTeamMembers,
    createShare,
    createBulkShare,
    fetchSharePermissions,
    editShare,
    deleteShare,
    unshareWithTeam,
    publishFile
  }
)(withRouter(SharingModal));
