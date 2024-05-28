import React from 'react';
import { connect } from 'react-redux';
import { showBanner } from 'components/layouts/header/Banner/_selectors';

import { css } from 'react-emotion';
import { minWidth, SidebarBreakpointsWidth } from 'utils/media';
import variables from 'assets/sass/partials/_exports.scss';

const Sidebar = props => {
  const position = props.position || 'left';
  const show = typeof props.show !== 'undefined' ? props.show : true;

  return (
    <aside
      id={`sidebar${position !== 'left' ? '-' + position : ''}`}
      className={`position-${position} ${SidebarStyle} ${show ? 'sidebar-show' : ''} ${
        props.showBanner ? withBannerHeight : ''
      }`}
    >
      {props.children}
    </aside>
  );
};

export default connect(state => ({ showBanner: showBanner(state) }))(Sidebar);

const SidebarStyle = css({
  position: 'fixed',
  top: variables.headerH,

  height: `calc(100% - ${variables.headerH})`,
  display: 'flex',
  zIndex: '1',
  transition: 'all 0.3s ease',
  width: SidebarBreakpointsWidth.xs,

  '&.position-left': {
    left: 0,

    [minWidth.sm]: {
      width: SidebarBreakpointsWidth.sm
    },

    [minWidth.md]: {
      width: SidebarBreakpointsWidth.md
    },
    [minWidth.lg]: {
      width: SidebarBreakpointsWidth.lg
    },
    [minWidth.xl]: {
      width: SidebarBreakpointsWidth.xl
    }
  },

  '&.position-right': {
    right: -500,
    width: `calc(${SidebarBreakpointsWidth.xs} + 136px)`,

    [minWidth.sm]: {
      width: `calc(${SidebarBreakpointsWidth.sm} + 136px)`
    },

    [minWidth.md]: {
      width: `calc(${SidebarBreakpointsWidth.md} + 136px)`
    },
    [minWidth.xl]: {
      width: `calc(${SidebarBreakpointsWidth.lg} + 136px)`
    },
    [minWidth.hd]: {
      width: `calc(${SidebarBreakpointsWidth.xl} + 136px)`
    },

    '&.sidebar-show': {
      right: 0
    }
  }
});

const withBannerHeight = css`
  top: calc(${variables.headerH} + ${variables.bannerH});
`;
