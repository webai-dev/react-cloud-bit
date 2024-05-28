import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { fetchTeamMembers } from 'views/teammates/_actions';

class SelectUsers extends Component {
  getOptions = input => {
    return this.props
      .fetchTeamMembers({ team_id: this.props.active_team.id, search: input })
      .then(response => {
        let options = {};
        options.cache = true;

        if (response && input !== '') {
          options.options = response
            .filter(x => {
              return x.id !== this.props.user.id;
            })
            .map(x => {
              return { value: x.id, label: x.email };
            });
        }
        return options;
      });
  };

  render() {
    const { value, onChange, user, className } = this.props;

    return (
      <Select.Async
        value={value}
        onChange={onChange}
        loadOptions={this.getOptions}
        className={className ? className : ''}
        autoload={false}
        cache={false}
        placeholder="Enter email addresses"
      />
    );
  }
}
export default connect(
  state => ({
    active_team: state.teams.active,
    user: state.user
  }),
  { fetchTeamMembers }
)(SelectUsers);
