import variables from 'assets/sass/partials/_exports.scss';
import _get from 'lodash/get';
import moment from 'moment';
import React, { Component } from 'react';
import styled from 'react-emotion';
import Moment from 'react-moment';

class NotificationInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderLabel = this.renderLabel.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  renderLabel() {
    const { notification, active_team } = this.props;

    if (notification.category === 'team_actions') {
      return active_team.name;
    }

    return '';
  }

  renderContent() {
    const { notification } = this.props;

    if (notification.subcategory === 'share') {
      return (
        <div className="notification-info--content-share">
          <strong>{_get(notification, 'payload.creator.name', 'User')}</strong> has shared the{' '}
          {notification.type.replace('share.', '')}{' '}
          {_get(notification, 'payload.shareable.title', '')} with you.
        </div>
      );
    }

    return '';
  }

  render() {
    const { notification } = this.props;

    return (
      <Notification
        className={`notification-info notification-info--${notification.category.replace(
          '_',
          '-'
        )}`}
      >
        <div className="notification-info--label">
          <small>{this.renderLabel()}</small>
        </div>
        <div className="notification-info--content">{this.renderContent()}</div>
        <div className="notification-info--time">
          <Moment fromNow ago>
            {moment(notification.timestamp)
              .parseZone(notification.timestamp)
              .local()
              .format('YYYY-MM-DD HH:mm:ss')}
          </Moment>
          {' ago'}
        </div>
      </Notification>
    );
  }
}

export default NotificationInfo;

const Notification = styled('div')`
  word-break: break-word;
  white-space: normal;

  .notification-info--label {
    margin-bottom: ${variables.size4};
    line-height: 11px;

    small {
      font-size: ${variables.size10};
    }
  }

  .notification-info--content {
    font-size: ${variables.size14};
    line-height: 17px;
  }

  .notification-info--time {
    color: ${variables.secondary};
    font-size: ${variables.size12};
    margin-top: ${variables.size4};
    line-height: 13px;
  }

  &.notification-info--team-actions {
    .notification-info--label {
      color: #35ce8d;
    }
  }
`;
