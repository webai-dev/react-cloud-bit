import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';

import BrandInfo from './BrandInfo';
import { Scrollbar } from 'utils/styles/scrollbar';
import RenderLink from 'components/general/RenderLink';
import ButtonIcon from 'components/general/ButtonIcon';

import variables from 'assets/sass/partials/_exports.scss';
import { baseDomain } from 'utils/variables';

import { connect } from 'react-redux';

class PopUpActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTeams: false
    };
  }

  toggleMenu() {
    this.setState({ showTeams: !this.state.showTeams });
  }

  render() {
    const { user, team, teams } = this.props;

    return (
      <Fragment>
        <GroupWrapper
          className={`settings-group-wrapper d-flex flex-column${
            !this.state.showTeams ? ' active' : ''
          }`}
        >
          {team && team.id ? (
            <Group>
              <div className="dropdown-item dropdown-item-brand">
                <BrandInfo user={user} team={team} />
              </div>
              {['owner', 'admin'].includes(user.role.label) && (
                <Link
                  className="btn dropdown-item btn-dropdown-icon btn-bitshop-icon"
                  to={`/marketplace/bits`}
                >
                  <ButtonIcon icon="bitshop">Marketplace</ButtonIcon>
                </Link>
              )}
              {user.role.label !== 'guest' && (
                <Link
                  className="btn dropdown-item btn-dropdown-icon btn-settings-icon border-0"
                  to={`/settings/users/teammates`}
                >
                  <ButtonIcon icon="settings">Settings</ButtonIcon>
                </Link>
              )}

              {user.developer && (
                <Link
                  className="btn dropdown-item btn-dropdown-icon btn-settings-icon border-0"
                  to={`/sandbox`}
                >
                  <ButtonIcon icon="sandbox" width="9px">
                    Sandbox
                  </ButtonIcon>
                </Link>
              )}
            </Group>
          ) : null}
          <Group>
            <div className="dropdown-item dropdown-item-brand">
              <BrandInfo user={user} showUser={true} />
            </div>
            <RenderLink
              className="btn dropdown-item btn-dropdown-icon btn-user-icon"
              link={`/profile`}
            >
              <ButtonIcon icon="user">Profile</ButtonIcon>
            </RenderLink>

            <RenderLink
              className="btn dropdown-item btn-dropdown-icon btn-invitations-icon border-0"
              link={`/profile/invitations`}
            >
              <ButtonIcon icon="invitations">My invitations</ButtonIcon>
            </RenderLink>
            {user && user.superuser ? (
              <a
                className="btn dropdown-item btn-dropdown-icon btn-invitations-icon border-0"
                href={process.env.REACT_APP_ADMIN_URL}
                target="_blank"
              >
                <ButtonIcon icon="administration">Administration</ButtonIcon>
              </a>
            ) : null}
          </Group>
          <Group className="border-0">
            <button
              type="button"
              className="btn dropdown-item btn-dropdown-icon btn-change-icon btn-arrow-back-icon"
              onClick={e => this.toggleMenu()}
            >
              <ButtonIcon icon="change">Change Team</ButtonIcon>
            </button>
            <RenderLink
              className="btn dropdown-item btn-dropdown-icon btn-create-icon border-0"
              link={`/create`}
            >
              <ButtonIcon icon="create">Create new Team</ButtonIcon>
            </RenderLink>
          </Group>
          <Group className="border-top border-bottom-0 mt-auto">
            <RenderLink
              className="btn dropdown-item btn-dropdown-icon btn-logout-icon border-0"
              link="/logout"
            >
              <ButtonIcon icon="logout">Log out</ButtonIcon>
            </RenderLink>
          </Group>
        </GroupWrapper>

        <GroupWrapper
          className={`d-flex flex-column teams-group-wrapper${
            this.state.showTeams ? ' active' : ''
          }`}
        >
          <Group>
            <button
              type="button"
              className="btn dropdown-item btn-dropdown-icon btn-arrow-back-icon"
              onClick={e => this.toggleMenu()}
            >
              Back
            </button>
          </Group>
          <Group className={Scrollbar}>
            {teams.map(t => {
              return (
                <a
                  key={t.id}
                  href={`${window.location.protocol}//${t.subdomain}.${baseDomain()}`}
                  target="_self"
                  className="dropdown-item item-team d-flex align-items-center border-0"
                >
                  {t.photo ? (
                    <img alt="team img" src={t.photo} width="24" height="24" />
                  ) : (
                    <span className="team-av">{t.name[0]}</span>
                  )}

                  <span className="team-name pl-1">{t.name}</span>
                </a>
              );
            })}
          </Group>
          <Group>
            <RenderLink
              className="btn dropdown-item btn-dropdown-icon btn-create-icon btn-create-team-icon border-0"
              link={`/create`}
            >
              <ButtonIcon icon="create">Create new Team</ButtonIcon>
            </RenderLink>
          </Group>
        </GroupWrapper>
      </Fragment>
    );
  }
}

export default PopUpActions;

const GroupWrapper = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform, opacity;
  transition-property: transform, opacity;
  transition-duration: 0.25s;
  opacity: 0;

  &.settings-group-wrapper {
    transform: translateX(-302px);
  }

  &.teams-group-wrapper {
    transform: translateX(302px);

    > div {
      &:nth-child(2) {
        flex: 1;
        height: calc(100% - ${variables.size96});
        overflow: auto;
      }

      &:last-child {
        border: none;
      }
    }
  }

  &.active {
    transform: translateX(0);
    opacity: 1;
  }
`;

const Group = styled('div')`
  border-bottom: 1px solid ${variables.linesGray};

  .dropdown-item {
    &.dropdown-item-brand {
      height: auto;
      padding-top: ${variables.size24};
      background: none;

      .brand-info {
        width: 100%;
        justify-content: flex-start !important;

        .brand-info-photo {
          > img,
          > span {
            width: 32px;
            height: 32px;
            font-size: ${variables.size16};
          }
        }

        .brand-info-text {
          width: 100%;
          max-width: 100%;

          .brand-info-main {
            font-size: ${variables.size14};
            line-height: ${variables.size16};
          }

          .brand-info-sec {
            margin-top: 0 !important;
            line-height: ${variables.size12};
          }
        }

        &:after {
          display: none;
        }
      }
    }
  }
`;
