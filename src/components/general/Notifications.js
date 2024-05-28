import React from 'react';
import { connect } from 'react-redux';

import ReactNotifications from 'react-notification-system-redux';
import style from 'utils/alerts/style';

const Notifications = ({ notifications, remove }) => {
  const notificationsNoDuplicates = notifications.reduce((filteredNotifications, notification) => {
    const { title, message } = notification;
    if (filteredNotifications.find(n => n.title === title && n.message === message)) {
      remove(notification.uid);
      return filteredNotifications;
    } else {
      return [...filteredNotifications, notification];
    }
  }, []);

  return <ReactNotifications notifications={notificationsNoDuplicates} style={style} />;
};

const mapStateToProps = state => ({
  notifications: state.alerts
});

const mapDispatchToProps = dispatch => ({
  remove: uid => dispatch(ReactNotifications.hide(uid))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
