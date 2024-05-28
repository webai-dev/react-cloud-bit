import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { selectPlansWithProducts, selectActivePlans } from '../store/_selectors';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import loader from 'assets/svg/general/loader.svg';

import { Switch } from '../common';
import Plan from './Plan';
import Storage from './Storage';
import Slider from './Slider';

const enhance = compose(
  withRouter,
  connect(state => ({
    plans: selectPlansWithProducts(state).filter(plan => plan.product.type === 'main'),
    activePlans: selectActivePlans(state),
    fetching: state.marketplace.plans.fetching || state.marketplace.products.fetching,
    fetchingSubs: state.marketplace.subscriptions.fetching,
    locked: state.teams.active.locked
  }))
);
class PlansListing extends Component {
  hasIntervalOptions = product =>
    this.props.plans.filter(p => p.product.id === product.id).length > 1;

  getTopPlans = () => {
    const topPlans = this.props.plans
      .filter(plan => this.hasIntervalOptions(plan.product))
      .filter(plan => !plan.product.custom)
      .filter(plan => plan.interval === this.props.selectedInterval)
      .sort((a, b) => a.amount - b.amount);
    const customPlan = this.props.plans.find(
      plan => plan.product.custom && plan.interval === this.props.selectedInterval
    );
    return customPlan ? [...topPlans, customPlan] : topPlans;
  };

  getStoragePlans = () =>
    this.props.plans
      .filter(plan => !this.hasIntervalOptions(plan.product))
      .sort((a, b) => a.amount - b.amount);

  getActiveStoragePlan = () => {
    if (this.props.activePlans.storage) return this.props.activePlans.storage;
    else return 'plans_storage';
  };

  goToContactForm = () => this.props.history.push('/marketplace/contact');

  render() {
    const {
      plans,
      activePlans,
      selectedInterval,
      fetching,
      toggleSelectedInterval,
      selectPlan,
      fetchingSubs,
      locked
    } = this.props;

    const showLoader = plans.length === 0 && fetching;
    return (
      <Fragment>
        <PlansSection>
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <Title>Select a plan</Title>
              <Switch
                labels={['Monthly', 'Yearly']}
                checked={selectedInterval === 'year'}
                toggle={toggleSelectedInterval}
              />
            </div>
            <Wrapper>
              {showLoader ? (
                <LoaderWrapper>
                  <img alt="loader" width={48} height={48} src={loader} />
                </LoaderWrapper>
              ) : (
                <Fragment>
                  <Plan
                    id="free"
                    interval={selectedInterval}
                    amount={0}
                    product={{
                      id: 'free',
                      type: 'free',
                      name: 'Free',
                      description: '16 GB of Team Storage.  It is free, and it will always be'
                    }}
                    active={!activePlans.main}
                    onClick={selectPlan('free')}
                    hideButton={fetchingSubs}
                    disabled={locked}
                  />
                  {this.getTopPlans().map(plan => (
                    <Plan
                      key={plan.id}
                      {...plan}
                      active={activePlans.main === plan.id}
                      onClick={selectPlan(plan.id)}
                      hideButton={fetchingSubs}
                      disabled={plan.product.disabled || locked}
                    />
                  ))}
                  {!plans.find(plan => plan.product.custom) && (
                    <Plan
                      interval={this.props.selectedInterval}
                      amount={this.props.selectedInterval === 'month' ? 45000 : 400000}
                      starting={true}
                      product={{
                        id: 'custom_template',
                        type: 'custom_template',
                        name: 'Custom',
                        description:
                          'Integrate with your AWS S3 Storage. Custom Bits specially designed for you.'
                      }}
                      onClick={this.goToContactForm}
                      hideButton={fetchingSubs}
                      disabled={locked}
                    />
                  )}
                </Fragment>
              )}
            </Wrapper>
          </div>
        </PlansSection>
        <Title className="mb-3">Storage options</Title>
        <StorageWrapper className="mb-12">
          {showLoader ? (
            <LoaderWrapper>
              <img alt="loader" width={48} height={48} src={loader} />
            </LoaderWrapper>
          ) : (
            <Fragment>
              <div className="mr-6">
                <Storage />
              </div>
              <Slider>
                {this.getStoragePlans().map(plan => (
                  <Plan
                    compact
                    key={plan.id}
                    {...plan}
                    active={activePlans.main === plan.id}
                    onClick={selectPlan(plan.id)}
                    hideButton={fetchingSubs}
                    disabled={plan.product.disabled || locked}
                  />
                ))}
              </Slider>
            </Fragment>
          )}
        </StorageWrapper>
      </Fragment>
    );
  }
}

export default enhance(PlansListing);

const PlansSection = styled('div')`
  padding: ${variables.size40} 0;
  margin-bottom: ${variables.size32};
  padding-top: 0;
  border-bottom: 1px solid ${variables.disabled};
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const StorageWrapper = styled('div')`
  display: flex;
`;

const Title = styled('div')`
  font-size: 16px;
  font-weight: bold;
`;

const LoaderWrapper = styled('div')`
  width: 100%;
  height: 330px;

  display: flex;
  align-items: center;
  justify-content: center;
`;
