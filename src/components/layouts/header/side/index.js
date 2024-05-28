import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import styled from 'react-emotion';

import BrandInfo from './BrandInfo';
import PopUpActions from './PopUpActions';

import variables from 'assets/sass/partials/_exports.scss';

class HeaderSide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      dropdownSettingsOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(key) {
    this.setState({
      [key]: !this.state[key]
    });
  }

  render() {
    const { user, team, teams } = this.props;

    return (
      <BrandWrap
        user={user}
        className="brand-wrap d-flex align-items-center justify-content-center pl-3 pr-3"
      >
        <ButtonDropdown
          isOpen={this.state.dropdownSettingsOpen}
          toggle={() => this.toggle('dropdownSettingsOpen')}
        >
          <DropdownToggle
            className={`btn-dropdown btn-empty btn-block btn-profile-toggle p-0 ${
              this.state.dropdownSettingsOpen ? 'btn-open' : ''
            } `}
          >
            <BrandInfo
              team={team && team.id ? team : null}
              user={user}
              showUser={team && team.id ? false : true}
            />
          </DropdownToggle>
          <DropdownMenu>
            <PopUpActions team={team} user={user} teams={teams} />
          </DropdownMenu>
        </ButtonDropdown>
      </BrandWrap>
    );
  }
}

export default HeaderSide;

const BrandWrap = styled('div')`
  width: 100%;
  height: 88px;

  .dropdown-menu {
    position: fixed !important;
    left: 0 !important;
    transform: translate3d(2rem, 5.5rem, 0px) !important;
    overflow: hidden;
    height: ${({ user }) => {
      let length = 376; // for guests
      if (user.superuser) length += 50; // show adminisstration
      if (user.developer) length += 50;
      if (user.role.label === 'guest') return length;
      // show settings
      else if (user.role.label === 'member') return length + 50;
      // show marketplace
      else return length + 100;
    }}px;

  .btn-profile-toggle {
    height: 56px;

    .brand-info {
      position: relative;
      max-width: 264px;

      .brand-info-photo {
        > img,
        > span {
          border-radius: 3px;
          border: 1px solid ${variables.linesGray};
        }
      }

      .brand-info-text {
        max-width: 132px;
        min-width: 132px;
        overflow: hidden;

        .brand-info-main {
          color: ${variables.textHead};
          font-size: ${variables.size16};
          font-weight: 500;
        }

        .brand-info-sec {
          color: ${variables.textSec};
          font-size: ${variables.size12};
        }
      }

      &:after {
        position: absolute;
        content: '';
        border: solid ${variables.textHead};
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
        display: inline-block;
        padding: 3px;
        right: -1rem;
        top: 12px;
      }
    }
  }
`;
