import React from 'react';

import { NavLink } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import SvgRender from 'components/general/SvgRender';

const Dropdown = () => (
  <UncontrolledDropdown>
    <Toggle>
      <div className="d-flex align-items-center">
        <SvgRender
          path={require('assets/svg/public/logged_in.svg')}
          style={{ height: 28, marginRight: 16 }}
        />
        <SvgRender path={require('assets/svg/general/arrow-dropdown.svg')} style={{ height: 6 }} />
      </div>
    </Toggle>
    <DropdownMenu right className="drodown-menu" style={{ width: 240 }}>
      <Link to={`/intro`}>
        <DropdownItem border>
          <SvgRender
            path={require('assets/svg/public/go_to_teams.svg')}
            style={{ height: 16, marginRight: 8 }}
          />
          Go to teams
        </DropdownItem>
      </Link>
      <Link to={`/logout`}>
        <DropdownItem>
          <SvgRender
            path={require('assets/svg/actions/logout.svg')}
            style={{ height: 16, marginRight: 8 }}
          />
          Log out
        </DropdownItem>
      </Link>
    </DropdownMenu>
  </UncontrolledDropdown>
);
export default Dropdown;

const Toggle = styled(DropdownToggle)`
  background: transparent !important;
`;

const Link = styled(NavLink)`
  color: ${variables.head} !important;
  font-size: ${variables.size14};
  cursor: pointer;
`;

const DropdownItem = styled('div')`
  display: flex;
  align-items: center;

  height: ${variables.size48};
  padding: ${variables.size24};

  border-bottom: ${props => (props.border ? `1px solid ${variables.linesGray}` : 'none')};

  &:hover {
    background: ${variables.bgGray};
  }
`;
