import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCards, subscribe, cancelSubscription, addCard } from '../../store/_actions';
import { selectPlansWithProducts } from '../../store/_selectors';

import { Title, Checkrow } from './common';
import { ButtonRow, Button, Checkout } from '../../common';

const enhance = connect(
  (state, props) => ({
    plan: selectPlansWithProducts(state).find(plan => plan.id === props.planId),
    hasPaymentMethod: state.marketplace.cards.allIds.length > 0,
    isFetching: state.marketplace.cards.fetching,
    isSaving: state.marketplace.subscriptions.fetching
  }),
  { fetchCards, subscribe, cancelSubscription, addCard }
);
class BillingSummary extends Component {
  state = { saving: false };

  componentDidMount() {
    this.props.fetchCards();
  }

  subscribe = async () => {
    this.setState({ saving: true });
    await this.props.subscribe(this.props.planId);
    this.setState({ saving: false });
    this.props.onCancel();
  };

  onToken = async token => {
    this.setState({ saving: true });
    await this.props.addCard(token);
    await this.props.subscribe(this.props.planId);
    this.setState({ saving: false });
  };

  disableContinueButton = () =>
    (!this.props.hasPaymentMethod && this.props.isFetching) || this.props.isSaving;

  render() {
    const { plan, onCancel, hasPaymentMethod } = this.props;

    return (
      <div>
        <Title>Billing Summary</Title>
        <Checkrow>
          <li>
            You are buying the {plan.product.name}
            {plan.product.type === 'main' ? ' Plan' : ' Storage plan'}
          </li>
          <li> You are paying {plan.interval === 'year' ? 'Anually' : 'Monthly'} </li>
          <li> You will pay ${plan.amount / 100}</li>
        </Checkrow>
        <ButtonRow>
          <Button type="button" className="btn btn-icon-inactive" onClick={onCancel}>
            Cancel
          </Button>

          {hasPaymentMethod ? (
            <Button
              type="button"
              className="btn btn-success"
              onClick={this.subscribe}
              disabled={this.disableContinueButton()}
            >
              {this.state.saving ? 'Saving...' : 'Continue'}
            </Button>
          ) : (
            <Checkout
              onToken={this.onToken}
              description={plan.product.name}
              label={`Pay $${plan.amount / 100}`}
            >
              <Button
                type="button"
                className="btn  btn-success"
                disabled={this.disableContinueButton()}
              >
                Continue
              </Button>
            </Checkout>
          )}
        </ButtonRow>
      </div>
    );
  }
}
export default enhance(BillingSummary);
