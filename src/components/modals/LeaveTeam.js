import React, { Component } from 'react';
import { connect } from 'react-redux';
import { baseDomain } from 'utils/variables';

import { leaveTeam } from 'views/teams/_actions';

class LeaveTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submittting: false
    };
  }

  confirmLeave() {
    this.setState({ submittting: true });

    this.props
      .leaveTeam({ id: this.props.active_team.id, user_id: this.props.user.id })
      .then(data => {
        if (data) {
          setTimeout(() => {
            window.location.href = window.location.protocol + '//' + baseDomain() + '/intro';
          }, 1000);
        } else {
          this.setState({ submittting: false });
        }
      });
  }

  render() {
    return (
      <div className="p-4">
        <div className="row justify-content-center">
          <div className="col-12 mt-1">
            {`You are about to leave ${this.props.active_team.name}.`} Are you sure you want to
            continue?
            <br /> <strong>This operation cannot be undone.</strong>
          </div>
          <div className="col-12 text-right mt-6">
            <button
              type="button"
              className="btn btn-light pr-4 pl-4 ml-4"
              onClick={this.props.toggle}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-success ml-2 pr-4 pl-4"
              onClick={e => this.confirmLeave()}
              disabled={this.state.submittting}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    user: state.user
  };
}

export default connect(
  mapStateToProps,
  { leaveTeam }
)(LeaveTeam);
