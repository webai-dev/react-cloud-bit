import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import SvgRender from 'components/general/SvgRender';

import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import fullscreen from 'assets/svg/actions/fullscreen.svg';

import Breadcrumbs from 'components/general/Breadcrumbs';
import ShareButton from './ShareButton';

const Header = props => {
  return (
    <Wrapper>
      <Side>
        <Image src={props.active_team.photo} />
        <Details>
          <TeamName>{props.active_team.name}</TeamName>
          <UserName>{props.user.name}</UserName>
        </Details>
      </Side>
      <Main>
        <Breadcrumbs path={props.path} />
        <RightSide>
          {props.path && (
            <a
              className="btn active d-flex align-items-center btn-empty p-0 mr-3"
              href={`/folder/${props.path[props.path.length - 1].folder_id}`}
            >
              <SvgRender
                style={{ height: 16 }}
                className={`fullscreen-icon ${css`
                  transform: rotate(180deg);
                `}`}
                path={fullscreen}
              />
            </a>
          )}
          <ShareButton shares={props.shares} onClick={props.openModal} />
        </RightSide>
      </Main>
    </Wrapper>
  );
};

export default compose(
  withRouter,
  connect(state => ({
    active_team: state.teams.active,
    user: state.user
  }))
)(Header);

const Wrapper = styled('div')`
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  display: flex;

  height: ${variables.headerHFull};
  background: #fff;
  z-index: 10;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  padding: ${variables.size16};
`;

const Side = styled('div')`
  height: 100%;
  display: flex;
  min-width: 168px;
  border-right: 1px solid ${variables.linesGray};
`;

const Image = styled('img')`
  width: 48px;
  height: 48px;

  object-fit: cover;

  border: 1px solid ${variables.linesGray};
  border-radius: 3px;
`;

const Details = styled('div')`
  margin-left: 16px;
  margin-right: 16px;
`;

const TeamName = styled('div')`
  font-size: ${variables.size16};
  font-weight: 600;
`;

const UserName = styled('div')`
  font-size: ${variables.size12};
  color: ${variables.secondary};
`;

const Main = styled('div')`
  height: 100%;
  flex-grow: 1;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-left: 24px;
  padding-right: 72px;
`;

const RightSide = styled('div')`
  display: flex;
  align-items: center;
`;
