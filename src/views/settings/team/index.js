import React, { Component } from 'react';
import { connect } from 'react-redux';

import CreateTeamForm from 'views/teams/CreateTeamForm';
import DeleteCollapse from 'components/general/DeleteCollapse';
import Header from 'components/layouts/header';

import { menu } from 'views/settings/_helpers';
import { deleteTeam } from 'views/teams/_actions';
import { FormsBreakpointsClasses } from 'utils/media';

import TransferOwnership from './TransferOwnership/index.js';

class Team extends Component {
  componentDidMount() {
    document.title = 'Team settings | yBit';
  }
  componentWillUnmount() {
    document.title = 'yBit';
  }

  render() {
    const { active_team, user, isOwner } = this.props;
    return (
      <div className="content-inner-wrapper">
        <Header
          title={'Settings'}
          menu={
            user.role.label === 'owner' || user.role.label === 'admin'
              ? menu
              : menu.filter(m => m.label !== 'team')
          }
        />

        {user.role.label === 'owner' || user.role.label === 'admin' ? (
          <div className="row">
            <div className={FormsBreakpointsClasses}>
              <CreateTeamForm />

              <hr className="mt-6 mb-4" />

              {isOwner && <TransferOwnership />}
              <DeleteTeam
                collapseHeader="Delete Team"
                collapseBody={
                  <div>
                    <p>Deleting a team has the following effects:</p>
                    <ul>
                      <li>All the content of the team (files, folders & bits) will be lost.</li>
                      <li>Every team member will not be able to access the team.</li>
                      <li>The team’s subdomain will be available to any other yBit user to use.</li>
                    </ul>
                    <b>This action is irreversible.</b>
                  </div>
                }
                buttonText="Delete Team"
                modalHeader="Delete Team"
                modalBody={
                  <p>
                    You are about to delete your Ybit Team. You will not be able to recover your
                    files.
                    <b>This operation cannot be undone.</b>
                  </p>
                }
                deleteActionParams={{ id: active_team.id }}
              />
            </div>
          </div>
        ) : (
          "You don't have permissions to edit this team."
        )}
      </div>
    );
  }
}

const DeleteTeam = connect(
  null,
  { deleteAction: deleteTeam }
)(DeleteCollapse);

const mapStateToProps = state => {
  return {
    active_team: state.teams.active,
    user: state.user,
    isOwner: state.teams.active.user_id === state.user.id
  };
};

export default connect(
  mapStateToProps,
  {}
)(Team);
