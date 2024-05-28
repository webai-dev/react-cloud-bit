import variables from 'assets/sass/partials/_exports.scss';
import ButtonIcon from 'components/general/ButtonIcon';
import moment from 'moment';
import React, { Component } from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import {
  getUserTeamLastSeenTimestamp,
  getUserTeamNotifications,
  setUserTeamLastSeenTimestamp
} from 'state/notifications/_actions';
import { Scrollbar } from 'utils/styles/scrollbar';
import NotificationInfo from './NotificationInfo';

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.fetchNotifications = this.fetchNotifications.bind(this);
    this.setUserTeamLastSeenTimestamp = this.setUserTeamLastSeenTimestamp.bind(this);
  }

  setUserTeamLastSeenTimestamp() {
    if (
      this.props.notifications.unread_notifications.length &&
      !this.props.notifications.last_seen_setting
    ) {
      this.props.setUserTeamLastSeenTimestamp({
        user_id: this.props.user.id,
        team_id: this.props.active_team.id,
        last_seen: moment.utc().format('YYYY-MM-DD HH:mm:ss')
      });
    }
  }

  toggle() {
    this.setState(
      prevState => ({
        dropdownOpen: !prevState.dropdownOpen
      }),
      () => {
        if (!this.state.dropdownOpen) {
          this.setUserTeamLastSeenTimestamp();
        }
      }
    );
  }

  fetchNotifications() {
    let params = {
      user_id: this.props.user.id,
      team_id: this.props.active_team.id,
      per_page: this.props.notifications.per_page,
      init: this.props.notifications.init
    };

    if (this.props.notifications.last_seen) params.last_seen = this.props.notifications.last_seen;

    if (this.props.notifications.list.length > 0) {
      params.last_notification = this.props.notifications.list[
        this.props.notifications.list.length - 1
      ].timestamp;
    }

    this.props.getUserTeamNotifications(params);
  }

  getUserTeamLastSeenTimestamp = async () => {
    await this.props.getUserTeamLastSeenTimestamp({
      user_id: this.props.user.id,
      team_id: this.props.active_team.id,
      per_page: this.props.notifications.per_page
    });

    this.fetchNotifications();
  };

  handleClick(e, notification) {
    if (notification.subcategory === 'share') {
      this.props.history.push(
        `/${notification.type.replace('share.', '')}/${notification.payload.shareable.id}`
      );
    }
  }

  componentDidMount() {
    if (this.props.active_team && this.props.active_team.id && !this.props.notifications.init) {
      this.getUserTeamLastSeenTimestamp();
    }
  }

  render() {
    const { notifications, active_team } = this.props;
    const unread_notifications = notifications.unread_notifications.length;

    return (
      <NotificationsWrapper className="notifications-wrapper">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} direction="right">
          <DropdownToggle tag="div" className="btn btn-empty btn-notification-toggle p-0 pl-2 ml-2">
            <ButtonIcon icon="notifications" width={24} height={24} />
            {unread_notifications > 0 && (
              <div className="btn-notification-toggle--counter d-flex align-items-center justify-content-center">
                {unread_notifications}
              </div>
            )}
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem tag="div" className="py-2 no-hover size-14" toggle={false}>
              {unread_notifications > 0 ? (
                <div>
                  <strong>{unread_notifications}</strong> New Notifications
                </div>
              ) : (
                <div>No new notifications</div>
              )}
            </DropdownItem>
            <div className={'notifications-list ' + Scrollbar}>
              {notifications.list.map(notification => (
                <DropdownItem
                  key={notification.id}
                  tag="div"
                  toggle={false}
                  onClick={e => this.handleClick(e, notification)}
                  className={`btn ${
                    notifications.unread_notifications.findIndex(n => n.id === notification.id) !==
                    -1
                      ? 'unread'
                      : ''
                  }`}
                >
                  <NotificationInfo notification={notification} active_team={active_team} />
                </DropdownItem>
              ))}
            </div>
            {notifications.list.length > 0 ? (
              <DropdownItem
                className="py-2 justify-content-center btn-link size-14 btn no-hover"
                toggle={false}
                onClick={this.fetchNotifications}
              >
                View older
              </DropdownItem>
            ) : null}
          </DropdownMenu>
        </Dropdown>
      </NotificationsWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    user: state.user,
    notifications: state.notifications.team
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { getUserTeamNotifications, getUserTeamLastSeenTimestamp, setUserTeamLastSeenTimestamp }
  )(Notifications)
);

const NotificationsWrapper = styled('div')`
  .btn-notification-toggle {
    height: ${variables.size24};
    border-left: 1px solid ${variables.linesGray};
    position: relative;

    .btn-notification-toggle--counter {
      position: absolute;
      background: ${variables.iconFlagged};
      color: #fff;
      font-size: ${variables.size10};
      line-height: ${variables.size16};
      font-weight: bold;
      top: -2px;
      right: -2px;
      border-radius: 100%;
      padding: 2px;
      height: ${variables.size16};
      min-width: ${variables.size16};
    }
  }

  .dropdown-menu {
    left: ${variables.size40} !important;
    top: ${variables.size8} !important;

    .dropdown-item {
      height: auto;
      outline: none !important;
      border-top: 1px solid ${variables.bgGray};

      &.no-hover {
        background: none !important;
      }

      &.btn-link {
        color: ${variables.blue};
      }

      &.unread {
        background: ${variables.selected};
      }
    }

    .notifications-list {
      max-height: 20.5rem;
      overflow-y: auto;
    }
  }
`;
