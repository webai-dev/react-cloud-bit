import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'react-emotion';

import ButtonIcon from 'components/general/ButtonIcon';
import variables from 'assets/sass/partials/_exports.scss';

class Submenu extends Component {
  tabs = [
    {
      label: 'Teammates',
      key: 'teammates'
    },
    {
      label: 'Invitations',
      key: 'invitations'
    }
  ];

  render = () => {
    return (
      <Fragment>
        <div className="d-flex align-items-center justify-content-start mb-4">
          {this.tabs.map(({ key, label }) => (
            <NavLink key={key} to={`/settings/users/${key}`} className={Item}>
              {label}
            </NavLink>
          ))}
        </div>
        {this.props.action && (
          <div className="d-flex align-items-center justify-content-between mb-3">
            <NavLink
              className={'btn btn-main btn-dropdown-icon d-flex align-items-center'}
              to={'/settings/users/invite'}
            >
              <ButtonIcon icon="create-thin" iconClassName="create-plus-svg" width={12} height={12}>
                <ButtonText>Add new teammate(s)</ButtonText>
              </ButtonIcon>
            </NavLink>
          </div>
        )}
      </Fragment>
    );
  };
}

export default Submenu;

const Item = css`
  font-size: ${variables.size16};
  font-weight: 600;
  color: ${variables.textSec};

  padding-bottom: ${variables.size16};
  margin-right: ${variables.size40};

  border-bottom: 1px solid rgba(0, 0, 0, 0);

  &.active {
    color: ${variables.textHead};
    border-bottom: 1px solid ${variables.secondary};
  }
  :hover {
    cursor: pointer;
  }
`;

const ButtonText = styled('span')`
  color: ${variables.white};
  vertical-align: middle;
`;
