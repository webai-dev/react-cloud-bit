import React, { Component } from 'react';
import TermsModal from './modal';
import { connect } from 'react-redux';
import { acceptTerms } from 'views/user/_actions';
import { acceptApparatusTerms } from 'views/auth/_actions';

class AcceptTermsAfterSignIn extends Component {
  render() {
    const { hasAcceptedApparatusTerms, hasAcceptedYbitTerms } = this.props;
    return (
      <TermsModal
        showModal={true}
        hasAcceptedApparatusTerms={hasAcceptedApparatusTerms}
        hasAcceptedYbitTerms={hasAcceptedYbitTerms}
        onAccept={this.props.onSuccess}
      />
    );
  }
}

export default AcceptTermsAfterSignIn;
