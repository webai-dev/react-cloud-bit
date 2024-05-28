import React, { Component } from 'react';
import styled from 'react-emotion';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchFolders } from 'views/folders/_actions';

import variables from 'assets/sass/partials/_exports.scss';
import Sidebar from 'components/layouts/sidebar';

import Teams from './Teams';
import MainSidebar from './MainSidebar';
import MarketPlaceSidebar from 'views/marketplace/Sidebar';
import SandboxSidebar from 'views/sandbox/SandboxSidebar';
import check from 'assets/svg/pinboard/check.svg';

class LeftSidebar extends Component {
  getSidebarComponent = () => {
    if (!this.props.active_team.id) {
      return Teams;
    } else if (this.props.location.pathname.startsWith('/marketplace')) {
      return MarketPlaceSidebar;
    } else if (this.props.location.pathname.startsWith('/sandbox')) {
      return SandboxSidebar;
    } else {
      return MainSidebar;
    }
  };

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
  }

  render() {
    const Component = this.getSidebarComponent();

    return (
      <Sidebar position="left">
        <SidebarInnerWrap className="sidebar-inner-wrap sidebar-items shares d-flex pt-3">
          <Component />
        </SidebarInnerWrap>
      </Sidebar>
    );
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      active_team: state.teams.active,
      teams: state.teams.list,
      active_folder: state.folders.active,
      folders: state.folders.list
    }),
    { fetchFolders }
  )
)(LeftSidebar);

const SidebarInnerWrap = styled('div')`
  height: 100%;

  &.sidebar-items {
    padding: ${variables.size16} 0;
    flex: 1;
    border-top: 0;
    border-left: 0;
    border-bottom: 0;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;

    .shares-wrapper--shadow {
      box-shadow: inset 0px -10px 10px -10px rgba(0, 0, 0, 0.25);
      border-bottom: 1px solid #bebebe;
    }

    .shares-wrapper {
      display: inline-block;
      position: relative;
      height: inherit;
      overflow-y: auto;
      transition: all 200ms;

      .folder-tree-wrap {
        display: inline-block;
      }

      &.has-scrollbar {
        box-shadow: inset 0px -18px 10px -10px rgba(0, 0, 0, 0.25);
      }

      &.expanded {
        min-height: calc(100% - 11rem);
      }
    }
  }

  .btn-pinboard {
    font-family: ${variables.fontFamilyBase};
    font-size: ${variables.size18};
    color: ${variables.iconOutline};
    font-weight: bold;
    transition: all 0.3s;
    transform: scale(1);
    padding: 10px 50px 10px 20px;
    position: relative;
    .bg {
      background: ${variables.blue};
      width: 30px;
      height: 2px;
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -1px;
      z-index: -1;
      transition: all 0.3s;
      border-radius: 0px 1px 1px 0px;
      &:before,
      &:after {
        content: '';
        height: 2px;
        width: 6px;
        background: ${variables.blue};
        position: absolute;
        right: 0px;
        -webkit-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;
        border-radius: 2px;
      }
      &:before {
        bottom: 2px;
        transform: rotate(45deg);
      }
      &:after {
        top: 2px;
        transform: rotate(-45deg);
      }
    }

    &:not(.active) {
      &:hover {
        padding-right: 20px;
        color: #fff;
        .bg {
          height: 100%;
          width: 100%;
          transform: translate(0, -50%);
          &:before {
            bottom: 6px;
            right: 0;
          }
          &:after {
            top: 6px;
            right: 0;
          }
        }
      }
    }

    &.active {
      .bg {
        display: none;
      }

      &:after {
        content: '';
        background: url(${check}) no-repeat;
        height: ${variables.size20};
        width: ${variables.size20};
        top: calc(50% - 10px);
        right: ${variables.size16};
        position: absolute;
      }
    }
  }
`;
