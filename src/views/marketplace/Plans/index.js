import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchProducts, fetchPlans, fetchSubscriptions } from '../store/_actions';

import { ContentWrapper } from '../common';

import PlansListing from './PlansListing';
import Summary from './Summary';

const enhance = connect(
  state => ({ plans: state.marketplace.plans, subscriptions: state.marketplace.subscriptions }),
  { fetchProducts, fetchPlans, fetchSubscriptions }
);
class Plans extends Component {
  state = {
    selectedInterval: 'month',
    selectedPlan: null
  };

  componentDidMount() {
    this.props.fetchProducts();
    this.props.fetchPlans();
    this.props.fetchSubscriptions();
  }

  componentDidUpdate(prevProps) {
    const { subscriptions, plans } = this.props;
    const { subscriptions: prevSubscriptions, plans: prevPlans } = prevProps;
    // when subscriptions and plans finish fetching if the selected main plan is yealy switch the toggle
    if (
      (subscriptions.main && !prevSubscriptions.main && plans.allIds.length > 0) ||
      (plans.allIds.length > 0 && prevPlans.allIds.length === 0 && subscriptions.main)
    ) {
      this.setState({ selectedInterval: plans.byId[subscriptions.main.plan.id].interval });
    }
  }

  toggleSelectedInterval = () =>
    this.setState(prev => ({
      selectedInterval: prev.selectedInterval === 'month' ? 'year' : 'month'
    }));

  selectPlan = id => () => this.setState({ selectedPlan: id });
  cancelSelection = () => this.setState({ selectedPlan: null });

  render() {
    const { selectedPlan } = this.state;

    return (
      <ContentWrapper>
        {!selectedPlan ? (
          <PlansListing
            {...this.state}
            toggleSelectedInterval={this.toggleSelectedInterval}
            selectPlan={this.selectPlan}
          />
        ) : (
          <Summary planId={selectedPlan} onCancel={this.cancelSelection} />
        )}
      </ContentWrapper>
    );
  }
}
export default enhance(Plans);
