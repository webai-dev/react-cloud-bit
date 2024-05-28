import React, { Component } from 'react';
import Header from 'components/layouts/header';
import { Redirect, withRouter } from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchSandboxTypes } from 'views/sandbox/_actions';

class Sandbox extends Component {
  componentDidMount() {
    if (!this.props.sandboxTypesLoaded) {
      this.props.fetchSandboxTypes();
    }

    document.title = 'Sandbox | yBit';
  }

  render() {
    const { user, loaded } = this.props;

    if (!loaded) return null;

    if (!user.developer) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Header render={() => <div />} />
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loaded: state.sandbox.loaded,
    user: state.user
  };
};

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    { fetchSandboxTypes }
  )
)(Sandbox);
