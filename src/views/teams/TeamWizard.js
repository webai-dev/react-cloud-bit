import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from 'components/layouts/header';
import CreateTeamForm from './CreateTeamForm';
import { FormsBreakpointsClasses } from 'utils/media';

class TeamWizard extends Component {
  render() {
    const { active_team } = this.props;

    return (
      <div className="row">
        <div className={FormsBreakpointsClasses}>
          <Header
            title={` ${active_team && active_team.id ? 'Edit team' : 'Create new team'} `}
            menu={[]}
          />

          <CreateTeamForm />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    active_team: state.teams.active
  };
}

export default connect(
  mapStateToProps,
  {}
)(TeamWizard);
