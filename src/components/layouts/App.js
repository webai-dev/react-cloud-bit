import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { showBanner } from 'components/layouts/header/Banner/_selectors';

import LeftSidebar from 'components/layouts/sidebar/left/LeftSidebar';
import RightSidebar from 'components/layouts/sidebar/right/RightSidebar';

import FolderActionsPopUp from 'views/folders/FolderActionsPopUp';
import Home from 'views/Home';
import Main from 'components/layouts/Main';
import DirDropZone from 'components/dropzone/DirDropZone';
import Sandbox from 'components/layouts/Sandbox';
import AcceptYbitTerms from 'components/accept-terms/AcceptYbitTerms';

import { teamSubdomain } from 'utils/variables';
import { fetchTeams, setActiveTeam } from 'views/teams/_actions';
import { fetchUser } from 'views/user/_actions';
import { fetchRoles, fetchCurrentUserRole } from 'state/roles/_actions';
import { initFirebaseAuth, getMaintenanceNotification } from 'state/notifications/_actions';
import MaintenanceNotification from 'components/general/MaintenanceNotification';

const subdomain = teamSubdomain();

class App extends Component {
  componentDidMount() {
    if (this.props.authenticated && this.props.user.id === null) {
      this.props.fetchUser().then(data => {
        if (data) {
          this.props.fetchTeams().then(teams => {
            if (teams) {
              if (subdomain !== '') {
                this.props.setActiveTeam(subdomain, teams).then(team => {
                  this.props.fetchCurrentUserRole({ team_id: team.id });
                });

                this.props.fetchRoles();
              }
            }
          });

          // Firebase initial login
          this.props.initFirebaseAuth();
        }
      });

      this.props.getMaintenanceNotification();
    }
  }

  render() {
    return (
      <div className={`content app-content ${this.props.showBanner ? 'banner' : ''}`}>
        {!this.props.fullscreen && <LeftSidebar />}
        {subdomain !== '' && !this.props.active_team.id ? (
          <Home />
        ) : (
          <React.Fragment>
            {this.props.user && this.props.user.id && (
              <Main rightSideBarOpen={this.props.sidebar.show} fullscreen={this.props.fullscreen}>
                {this.props.sandbox ? (
                  <Sandbox>{this.props.children} </Sandbox>
                ) : (
                  this.props.children
                )}
                <DirDropZone />
              </Main>
            )}
            {this.props.active_clicked.current && this.props.active_clicked.current.id && (
              <FolderActionsPopUp history={this.props.history} />
            )}
          </React.Fragment>
        )}
        {!this.props.fullscreen && (
          <RightSidebar show={this.props.sidebar.show} activeTab={this.props.sidebar.activeTab} />
        )}
        <AcceptYbitTerms />
        <MaintenanceNotification maintenances={this.props.maintenances} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    active_clicked: state.folders.click_active,
    active_team: state.teams.active,
    active_folder: state.folders.active,
    status: state.dropzone.status,
    user: state.user,
    sidebar: state.sidebar,
    maintenances: state.notifications.maintenances,
    showBanner: showBanner(state)
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      fetchUser,
      fetchTeams,
      setActiveTeam,
      fetchRoles,
      fetchCurrentUserRole,
      initFirebaseAuth,
      getMaintenanceNotification
    }
  )(App)
);
