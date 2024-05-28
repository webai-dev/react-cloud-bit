import React, { Component } from 'react';
import { connect } from 'react-redux';
import { cancelSubscription } from '../../store/_actions';

import { Title, Checkrow } from './common';
import { ButtonRow, Button } from '../../common';

const enhance = connect(
  state => ({ isSaving: state.marketplace.subscriptions.fetching }),
  { cancelSubscription }
);
class BillingSummary extends Component {
  state = { saving: false };

  cancelSubscription = () => {
    this.setState({ saving: true });
    this.props.cancelSubscription(this.props.type).then(() => {
      this.setState({ saving: false });
      this.props.onCancel();
    });
  };

  render() {
    return (
      <div>
        <Title>Cancel Subscription</Title>
        <Checkrow>
          <li>You will cancel your subsciption</li>
          <li>Your storage limit will revert to default (16 GB) </li>
          <li>Your subscription will be canceled immediately</li>
          <li>This action is irreversible</li>
        </Checkrow>
        <ButtonRow>
          <Button type="button" className="btn btn-icon-inactive" onClick={this.props.onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            className="btn btn-success"
            onClick={this.cancelSubscription}
            disabled={this.props.isSaving}
          >
            {this.state.saving ? 'Saving...' : 'Continue'}
          </Button>
        </ButtonRow>
      </div>
    );
  }
}
export default enhance(BillingSummary);
