import React, { Component } from 'react';

import { connect } from 'react-redux';

import { teamSubdomain } from 'utils/variables';

import RootIndex from 'views/folders/RootIndex';
import Landing from 'views/public/Landing';

class Home extends Component {
  render() {
    const { active_team } = this.props;

    return active_team && active_team.id ? (
      <RootIndex {...this.props} />
    ) : teamSubdomain() === '' ? (
      <Landing />
    ) : null;
  }
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active
  };
}

export default connect(mapStateToProps, {})(Home);
