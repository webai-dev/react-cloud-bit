import React from 'react';
import { Col, Row } from 'reactstrap';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import RightSideActions from 'components/layouts/header/main/RightSideActions';
import { NavLink } from 'react-router-dom';

const Menu = ({ active_team, title, menu }) => (
  <Row className="header-actions-wrapper align-items-center justify-content-between pt-3 ">
    <Col xs="12">
      <Row>
        <Col xs="6">
          <Title className="mb-5">{title}</Title>
        </Col>
        <Col xs="6">
          <RightSideActions />
        </Col>
      </Row>
    </Col>
    <Col xs="12" className="mt-auto">
      <Row>
        {menu.map(({ name, label, path }) => (
          <Item xs="3" key={label}>
            <NavLink to={path} exact={true}>
              {name}
            </NavLink>
          </Item>
        ))}
      </Row>
    </Col>
  </Row>
);

export default Menu;

const Title = styled('div')`
  font-weight: bold;
  font-size: ${variables.size24};
  line-height: ${variables.size24};
`;

const Item = styled('div')`
  font-size: ${variables.size16};
  font-weight: 600;
  color: ${variables.textSec};
  margin: 0 ${variables.size20};
  height: ${variables.size40};

  > a {
    color: inherit;
    display: inline-block;
    height: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0);

    &.active {
      color: ${variables.textHead};
      border-bottom: 1px solid ${variables.secondary};
    }
  }
`;
