import React from 'react';
import { connect } from 'react-redux';

import Notifications from 'components/notifications';

const RightSideActions = ({ active_team, user, notifications }) => (
  <ul className="header-actions-list d-flex align-items-center justify-content-end list-unstyled m-0 pr-3">
    {active_team.id && user.id && notifications.init && <Notifications />}
  </ul>
);

function mapStateToProps(state, ownProps) {
  return {
    active_team: state.teams.active,
    user: state.user,
    notifications: state.notifications
  };
}

export default connect(
  mapStateToProps,
  {}
)(RightSideActions);
