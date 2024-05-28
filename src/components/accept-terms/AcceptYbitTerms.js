import React, { Component } from 'react';
import TermsModal from './modal';
import { connect } from 'react-redux';
import { acceptTerms } from 'views/user/_actions';
import { acceptApparatusTerms } from 'views/auth/_actions';

class AcceptYbitTerms extends Component {
  showModal = () => this.props.authenticated && this.props.hasAcceptedYbitTerms === false;

  handleAccept = () => {
    this.props.acceptTerms();
  };

  render() {
    return (
      <TermsModal
        {...this.props}
        showModal={this.showModal()}
        onAccept={this.handleAccept}
        hasAcceptedApparatusTerms={true}
        hasAcceptedYbitTerms={false}
      />
    );
  }
}

export default connect(
  state => ({
    authenticated: state.auth.authenticated,
    hasAcceptedYbitTerms: state.user.has_accepted_ybit_terms
  }),

  { acceptTerms, acceptApparatusTerms }
)(AcceptYbitTerms);
