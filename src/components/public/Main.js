import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Header from 'components/public/Header';
import Footer from 'components/public/Footer';

class Main extends Component {
  render() {
    const { withoutSections, className } = this.props;

    return (
      <div className={'content-inner-wrapper public-inner-wrapper ' + (className ? className : '')}>
        <Header
          authenticated={this.props.authenticated}
          loginHide={withoutSections ? withoutSections.includes('login') : false}
          key={this.props.location.pathname}
        />

        {this.props.children}

        <Footer />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(Main)
);
