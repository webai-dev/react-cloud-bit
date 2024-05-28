import React, { Fragment } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import SvgRender from 'components/general/SvgRender';

const MenuItem = ({ icon, route, label, subItems = [], depth = 0, location }) => {
  const isActive = location.pathname === route;
  return (
    <Fragment>
      <NavLink to={route}>
        <Container depth={depth} active={isActive}>
          <SvgRender path={icon} style={{ height: 18, marginRight: 12 }} />
          {label}
        </Container>
      </NavLink>
      {subItems.map(item => (
        <MenuItemwithRouter key={item.label} {...item} depth={depth + 1} />
      ))}
    </Fragment>
  );
};

const MenuItemwithRouter = withRouter(MenuItem);
export default MenuItemwithRouter;

const Container = styled('div')`
  margin-bottom: ${variables.size16};
  padding-left: ${props => 20 + 24 * props.depth}px;

  box-shadow: ${props => (props.active ? `inset 4px 0 0 ${variables.primary}` : 'none')};
  color: ${variables.head};

  display: flex;
  aling-items: center;
`;
