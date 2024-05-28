import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { showBanner } from 'components/layouts/header/Banner/_selectors';

import { Link } from 'react-router-dom';

import SvgRender from 'components/general/SvgRender';
import HeaderSide from './side';
import HeaderMain from 'components/layouts/header/main';

import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import { minWidth, SidebarBreakpointsWidth } from 'utils/media';

import create from 'assets/svg/actions/create.svg';
import logo_ybit from 'assets/svg/ybit/logo_ybit.svg';

import Banner from './Banner';

const Header = props => {
  const { active_team, isPinboard, user, teams, render, showBanner } = props;

  return (
    <Fragment>
      <HeaderWrap showBanner={showBanner} className="d-flex align-items-center header" id="header">
        <HeaderInner className={`d-flex left`}>
          {props.logo ? (
            <Link to={`/`}>
              <SvgRender style={{ height: 32 }} path={logo_ybit} wrapperClassName="h-100" />
            </Link>
          ) : (
            <TeamActionsWrap className="d-flex align-items-center pl-2 pr-2">
              <HeaderSide team={active_team} user={user} teams={teams} />
            </TeamActionsWrap>
          )}
        </HeaderInner>

        <HeaderInner className="pr-2 right">
          {render ? render() : <HeaderMain {...props} />}
        </HeaderInner>

        {isPinboard && user.role.label !== 'guest' && (
          <Link
            className={`btn-primary d-flex align-items-center justify-content-center ${CreatePinStyle}`}
            to={`/pin/create`}
          />
        )}
      </HeaderWrap>
      <Banner />
    </Fragment>
  );
};

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    teams: state.teams.list,
    active_folder: state.folders.active,
    user: state.user,
    showBanner: showBanner(state)
  };
}

export default connect(
  mapStateToProps,
  {}
)(Header);

const CreatePinStyle = css`
  position: fixed;
  bottom: ${variables.size80};
  right: ${variables.size80};
  border-radius: 100%;
  height: ${variables.size56};
  width: ${variables.size56};
  box-shadow: 4px 6px 32px -3px #9e9e9e;
  padding: 0;

  &:before {
    content: '';
    background: url(${create}) no-repeat;
    background-position: center center;
    width: 24px;
    height: 24px;
    display: inline-block;
  }
`;

export const HeaderWrap = styled('div')`
  position: fixed;
  width: 100%;
  left: 0;
  top: ${props => (props.showBanner ? variables.bannerH : 0)};
  height: ${props => (props.small ? variables.headerHFull : variables.headerH)};
  background: #fff;
  z-index: 10;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
`;

export const HeaderInner = styled('div')`
  height: 100%;

  &.left {
    width: ${variables.sidebarW};

    ${minWidth.xs + '{ width: ' + SidebarBreakpointsWidth.xs + '; }'};
    ${minWidth.sm + '{ width: ' + SidebarBreakpointsWidth.sm + '; }'};
    ${minWidth.md + '{ width: ' + SidebarBreakpointsWidth.md + '; }'};
    ${minWidth.lg + '{ width: ' + SidebarBreakpointsWidth.lg + '; }'};
    ${minWidth.xl + '{ width: ' + SidebarBreakpointsWidth.xl + '; }'};
  }

  &.right {
    flex: 1;
    padding-left: ${variables.size32};

    .header-title {
      font-size: ${variables.size16};
      margin-bottom: 0;
      line-height: ${variables.size32};
    }

    .header-actions-wrapper {
      height: 100%;
    }
  }
`;

export const TeamActionsWrap = styled('div')`
  flex: 1;
  overflow: hidden;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    height: calc(100% - ${props => (props.small ? '20px' : '40px')});
    width: 2px;
    right: 0;
    background: ${variables.linesGray};
    top: ${props => (props.small ? '10px' : '20px')};
  }

  .btn-dropdown {
    + .dropdown-menu {
      top: 8px !important;
    }
  }
`;
