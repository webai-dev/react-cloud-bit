import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import items from './items';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import MenuItem from './MenuItem';

const Sidebar = ({ location }) => (
  <Fragment>
    <Title>Marketplace</Title>
    {items.map(item => (
      <MenuItem key={item.label} {...item} />
    ))}
    <BackWrapper>
      <NavLink to="/">Back to folders</NavLink>
    </BackWrapper>
  </Fragment>
);

export default Sidebar;

const Title = styled('div')`
  margin: ${variables.size24} ${variables.size20};
  margin-top: ${variables.size8};
  font-size: ${variables.size24};
`;

const BackWrapper = styled('div')`
  margin-top: ${variables.size48};
  margin-left: ${variables.size20};
  a {
    color: ${variables.secondary};

    &:hover {
      color: ${variables.head};
    }

    &:before {
      content: '';
      display: inline-block;
      height: 10px;
      width: 10px;
      border-style: solid;
      border-color: inherit;
      border-width: 0px 1px 1px 0px;
      transform: rotate(135deg);
      margin-right: ${variables.size8};
    }
  }
`;
