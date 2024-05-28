import React, { Component } from 'react';
import { apiService } from 'utils/api';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { ContentWrapper } from '../common';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const enhance = compose(
  withRouter,
  connect(state => ({ team: state.teams.active.id }))
);
class ContactForm extends Component {
  state = {
    step: 1,
    submiting: false,
    firstName: 'asdadsasd',
    lastName: '',
    email: '',
    companyName: '',
    employees: null,
    storage: null,
    customBits: false,
    integration: false
  };

  nextStep = () => this.setState(prev => ({ step: prev.step + 1 }));
  prevStep = () => this.setState(prev => ({ step: prev.step - 1 }));
  goBack = () => this.props.history.push('/marketplace/plans');
  submit = () =>
    apiService.post(`/teams/${this.props.team}/subscriptions/contact`, {
      name: this.state.firstName,
      surname: this.state.lastName,
      email: this.state.email,
      company: this.state.companyName,
      company_size: this.state.employees,
      required_storage: this.state.storage,
      custom_bits: this.state.customBits,
      s3_integration: this.state.integration
    });

  setFields = (fields, cb) => this.setState({ ...fields }, cb);

  render() {
    const { step } = this.state;
    return (
      <form onSubmit={this.submit}>
        <ContentWrapper>
          <div style={{ display: step === 1 ? 'block' : 'none' }}>
            <Step1
              {...this.state}
              setFields={this.setFields}
              goBack={this.goBack}
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              submit={this.submit}
              error={this.error}
              submiting={this.submitting}
            />
          </div>
          <div style={{ display: step === 2 ? 'block' : 'none' }}>
            <Step2
              {...this.state}
              setFields={this.setFields}
              goBack={this.goBack}
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              submit={this.submit}
              error={this.error}
              submiting={this.submitting}
            />
          </div>
          <div style={{ display: step === 3 ? 'block' : 'none' }}>
            <Step3
              {...this.state}
              setFields={this.setFields}
              goBack={this.goBack}
              nextStep={this.nextStep}
              prevStep={this.prevStep}
              submit={this.submit}
              error={this.error}
              submiting={this.submitting}
            />
          </div>
        </ContentWrapper>
      </form>
    );
  }
}

export default enhance(ContactForm);
