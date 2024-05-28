import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import { minWidth, SidebarBreakpointsWidth } from 'utils/media';

class Main extends Component {
  render() {
    const Wrapper = this.props.fullscreen ? MainWrapFullscreen : MainWrap;
    return (
      <Wrapper
        id="main"
        className={`dropzone ${this.props.rightSideBarOpen ? 'sidebar-open' : ''}`}
      >
        <div className="d-flex align-items-stretch">
          {this.props.fullscreen ? (
            this.props.children
          ) : (
            <ContentWrap>{this.props.children}</ContentWrap>
          )}
        </div>
      </Wrapper>
    );
  }
}

export default Main;

const ContentWrap = styled('div')`
  width: 100%
  padding: ${variables.size24} ${variables.size32} ${variables.size24} ${variables.size32};
`;

const MainWrap = styled('main')(props => ({
  position: 'relative',
  transition: 'all 0.3s ease',
  top: variables.headerH,
  left: variables.sidebarW,
  width: `calc(100% - ${variables.sidebarW})`,
  height: `calc(100vh - ${variables.headerH})`,

  'overflow-y': 'auto',
  'overflow-x': 'hidden',

  // ['&.sidebar-open']: {
  //   width: `calc(100% - ${SidebarBreakpointsWidth.sm} - ${SidebarBreakpointsWidth.xs} - 136px)`,

  //   [minWidth.sm]: {
  //     width: `calc(100% - ${SidebarBreakpointsWidth.sm} - ${SidebarBreakpointsWidth.sm} - 136px)`
  //   },

  //   [minWidth.md]: {
  //     width: `calc(100% - ${SidebarBreakpointsWidth.md} - ${SidebarBreakpointsWidth.md} - 136px)`
  //   },
  //   [minWidth.xl]: {
  //     width: `calc(100% - ${SidebarBreakpointsWidth.xl} - ${SidebarBreakpointsWidth.lg} - 136px)`
  //   },
  //   [minWidth.hd]: {
  //     width: `calc(100% - ${SidebarBreakpointsWidth.xl} - ${SidebarBreakpointsWidth.xl} - 136px)`
  //   }
  // },

  [minWidth.xs]: {
    left: SidebarBreakpointsWidth.xs,
    width: `calc(100% - ${SidebarBreakpointsWidth.xs})`
  },

  [minWidth.sm]: {
    left: SidebarBreakpointsWidth.sm,
    width: `calc(100% - ${SidebarBreakpointsWidth.sm})`
  },

  [minWidth.md]: {
    left: SidebarBreakpointsWidth.md,
    width: `calc(100% - ${SidebarBreakpointsWidth.md})`
  },

  [minWidth.lg]: {
    left: SidebarBreakpointsWidth.lg,
    width: `calc(100% - ${SidebarBreakpointsWidth.lg})`
  },

  [minWidth.xl]: {
    left: SidebarBreakpointsWidth.xl,
    width: `calc(100% - ${SidebarBreakpointsWidth.xl})`
  }
}));

const MainWrapFullscreen = styled('main')(props => ({
  position: 'relative',
  transition: 'all 0.3s ease',
  top: variables.headerHFull,
  left: 0,
  width: '100%',
  height: `calc(100vh - ${variables.headerHFull})`,

  'overflow-y': 'auto',
  'overflow-x': 'hidden'
}));
