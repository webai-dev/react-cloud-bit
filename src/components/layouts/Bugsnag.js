import React from 'react';
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

import { connect } from 'react-redux';

let bugsnagClient = bugsnag({
  apiKey: process.env.REACT_APP_BUGSNAG_KEY,
  releaseStage: process.env.REACT_APP_RELEASE_STAGE,
  notifyReleaseStages: ['production', 'staging'],
  appVersion:
    process.env.REACT_APP_RELEASE_STAGE !== 'development'
      ? process.env.REACT_APP_APP_VERSION
      : 'development'
});

bugsnagClient.use(bugsnagReact, React);
bugsnagClient.metaData = {};

const ErrorBoundary = bugsnagClient.getPlugin('react');

class Bugsnag extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.user.id && !prevProps.user.id) {
      bugsnagClient.user = {
        id: this.props.user.id,
        name: this.props.user.name,
        email: this.props.user.email
      };
    } else if (!this.props.user.id && prevProps.user.id) {
      bugsnagClient.user = null;
    }

    if (this.props.active_team && this.props.active_team.id) {
      if (
        !bugsnagClient.metaData.team ||
        (bugsnagClient.metaData.team &&
          bugsnagClient.metaData.team.id !== this.props.active_team.id)
      ) {
        bugsnagClient.metaData.team = {
          ...this.props.active_team
        };
      }
    } else {
      bugsnagClient.metaData.team = null;
    }
  }

  render() {
    return <ErrorBoundary>{this.props.children}</ErrorBoundary>;
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    active_team: state.teams.active
  };
};

export default connect(
  mapStateToProps,
  null
)(Bugsnag);
