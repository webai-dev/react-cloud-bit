import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import FolderTree from 'views/folders/FolderTree';
import LinkItem from './LinkItem';
import Actions from './Actions';
import { NavLink } from 'react-router-dom';
import { Scrollbar } from 'utils/styles/scrollbar';
import { teamSubdomain } from 'utils/variables';

import { fetchTeams } from 'views/teams/_actions';
import { collapseRootFolder, fetchFolders } from 'views/folders/_actions';

import folderSvg from 'assets/svg/general/shared-folder.svg';
import dashboardSvg from 'assets/svg/general/dashboard-colored.svg';

class MainSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subdomain: teamSubdomain(),
      hasOverflowingChildren: false
    };

    this.handleShareClick = this.handleShareClick.bind(this);
    this.handleRootClick = this.handleRootClick.bind(this);
  }

  isActive(team) {
    if (this.props.active_team && this.props.active_team.id && this.props.active_team.id == team.id)
      return 'active';

    return '';
  }

  handleShareClick(s, e) {
    if (e.ctrlKey || e.metaKey || e.button === 1)
      window.open(`${window.location.origin}/folder/${s.id}`);
    else if (e.button === 2) return;
    else this.props.history.push(`/folder/${s.id}`);
  }

  handleRootClick(type) {
    if (type === 'collapse') {
      this.props.collapseRootFolder();
    } else {
      this.props.history.push('/');
    }
  }

  componentDidMount() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.addEventListener('contextmenu', e => e.preventDefault());

    if (
      this.props.active_folder &&
      this.props.folders.findIndex(f => f.id == this.props.active_folder) === -1 &&
      this.props.active_team.id
    ) {
      this.props.fetchFolders({
        team_id: this.props.active_team.id,
        folder_id: this.props.active_folder
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active_team.id !== prevProps.active_team.id) {
      this.props.fetchFolders({ team_id: this.props.active_team.id, root_folders: true });
    }

    const element = this.foldersTreeContainer;
    const hasOverflowingChildren =
      element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth;
    if (hasOverflowingChildren !== this.state.hasOverflowingChildren) {
      this.setState({ hasOverflowingChildren });
    }
  }

  render() {
    const { root_folders, active_folder, rootOpen, user, active_team, folders } = this.props;
    const { hasOverflowingChildren } = this.state;

    return (
      <Fragment>
        <div className={`mb-3`}>{!active_team.locked && <Actions />}</div>

        <div
          ref={ref => (this.foldersTreeContainer = ref)}
          className={`shares-wrapper w-100 ${
            hasOverflowingChildren ? 'shares-wrapper--shadow' : ''
          } ${Scrollbar}`}
        >
          <LinkItem to="/dashboard" text="Dashboard" icon={dashboardSvg} />

          {(user.role.label !== 'guest' || folders.length > 0) && (
            <FolderTree
              active={active_folder}
              rootActive={
                this.props.location.pathname === '/' ||
                this.props.location.pathname === '/folder/create'
                  ? true
                  : false
              }
              rootOpen={rootOpen}
              handleShareClick={this.handleShareClick}
              handleRootClick={this.handleRootClick}
              rightClick={true}
              history={this.props.history}
            />
          )}

          <LinkItem to="/shared" text="Shared with me" icon={folderSvg} shared={true} />

          {root_folders.length === 0 && user.role.label !== 'guest' && (
            <div className="shares-empty-text head-text mx-3 my-2 pl-1 pr-1">
              <small>
                You can create a folder or a bit, and share them with your preferred teammates.
              </small>
            </div>
          )}
        </div>
        <div className="mt-4 d-flex justify-content-center">
          <NavLink to={`/pinboard`} className="btn-pinboard" exact={true}>
            {`${this.props.match.url == '/pinboard' ? 'You’re in Pinboard' : 'Go to Pinboard'}`}
            <span className="bg" />
          </NavLink>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    teams: state.teams.list,
    active_team: state.teams.active,
    active_folder: state.folders.active,
    active_clicked: state.folders.click_active,
    authenticated: state.auth.authenticated,
    invitations: state.invitations.list,
    root_folders: state.folders.list.filter(f => f.root),
    folders: state.folders.list,
    rootOpen: state.folders.rootOpen
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      fetchTeams,
      collapseRootFolder,
      fetchFolders
    }
  )(MainSidebar)
);
