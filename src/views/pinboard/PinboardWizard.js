import React, { Component } from 'react';
import { connect } from 'react-redux';
import _find from 'lodash/find';

import Header from 'components/layouts/header';

import Input from 'components/inputs';
import { FormsBreakpointsClasses } from 'utils/media';

import { pinComponents } from './_helpers';
import { fetchPinTypes, fetchPin } from './_actions';

class PinboardWizard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: null
    };
  }

  componentDidMount = () => {
    this.props.fetchPinTypes().then(data => {
      if (data) {
        if (this.props.match.params.id) {
          this.props
            .fetchPin({ id: this.props.match.params.id, team_id: this.props.active_team.id })
            .then(data => {
              if (data) {
                this.setState({ type: data.content_type });
              }
            });
        }
      }
    });
  };

  onFieldChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  handleRedirect = () => {
    this.props.history.push(`/pinboard`);
  };

  render() {
    const { pinTypes, history, user } = this.props;

    return (
      <div>
        <Header title={this.props.match.params.id ? 'Edit pin' : 'Create new pin'} />

        {user.role.label !== 'guest' ? (
          <div className={FormsBreakpointsClasses}>
            <Input
              tag="select"
              name="type"
              placeholder="Choose pin type"
              label="Type"
              value={this.state.type}
              onChange={this.onFieldChange}
              options={pinTypes}
              clearable={false}
              searchable={false}
              disabled={this.props.match.params.id ? true : false}
            />
            {this.state.type ? (
              _find(pinTypes, ['value', this.state.type]) &&
              pinTypes &&
              pinComponents[_find(pinTypes, ['value', this.state.type]).value]({
                typeId: _find(pinTypes, ['value', this.state.type]).type_id,
                pinId: this.props.match.params.id,
                history: history
              })
            ) : (
              <div className="row">
                <div className="col-12 text-right mt-1">
                  <button
                    type="button"
                    className="btn btn-remove-link mt-1 ml-2"
                    onClick={this.handleRedirect}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          "You don't have permissions to edit the team's pinboard."
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pinTypes: state.pinboard.pinTypes,
    active_team: state.teams.active,
    user: state.user
  };
}

export default connect(
  mapStateToProps,
  { fetchPinTypes, fetchPin }
)(PinboardWizard);
