import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { showBanner, bannerType } from './_selectors';
import { dismiss } from './_actions';

import { NavLink } from 'react-router-dom';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import SvgRender from 'components/general/SvgRender';

const enhance = connect(
  state => ({
    show: showBanner(state),
    type: bannerType(state),
    role: state.user.role.label
  }),
  { dismiss }
);
const Banner = ({ show, type, role, dismiss }) =>
  show ? (
    <Container level={type.level}>
      <Left>
        <SvgRender
          path={require('assets/svg/alerts/warnCurrentColor.svg')}
          style={{ height: 16, marginRight: 8, marginLeft: 64 }}
        />
        <b className="mr-1">Warning! </b>
        {type.value === 'team_locked' ? (
          <Fragment>
            <div className="mr-2">Your team is locked! </div>
            {['owner', 'admin'].includes(role) ? (
              <Link to="/marketplace/invoices">Reactivate team</Link>
            ) : (
              role !== 'initial' && <div>Contact your administrator</div>
            )}
          </Fragment>
        ) : type.value === 'storage_warning' ? (
          <Fragment>
            <div className="mr-2">You are using more than 90% </div>
            {['owner', 'admin'].includes(role) ? (
              <Link to="/marketplace/plans">Update your plan</Link>
            ) : (
              role !== 'initial' && <div>Contact your administrator</div>
            )}
          </Fragment>
        ) : null}
      </Left>
      {type.level !== 'danger' && (
        <CloseButton>
          <SvgRender
            path={require('assets/svg/actions/close.svg')}
            style={{ height: 12, cursor: 'pointer', marginRight: 40 }}
            onClick={dismiss}
          />
        </CloseButton>
      )}
    </Container>
  ) : null;
export default enhance(Banner);

const Container = styled('div')`
  height: ${variables.bannerH};
  top: 0;
  left: 0;
  position: fixed;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: ${variables.size14};
  height: ${variables.bannerH};
  background-color: ${props => (props.level === 'danger' ? variables.alertErrorBg : '#EDDC95')};
  color: ${props =>
    props.level === 'danger' ? variables.alertErrorColor : variables.alertWarningColor};
  transtion: all 0.3s;
`;

const Left = styled('div')`
  align-items: center;
  display: flex;
`;
const Link = styled(NavLink)`
  text-decoration: underline !important;
  color: ${variables.main};
  &:hover {
    color: ${variables.head};
  }
`;

const CloseButton = styled('div')`
  path {
    fill: currentColor !important;
  }
`;
