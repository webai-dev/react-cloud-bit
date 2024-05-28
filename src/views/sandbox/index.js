import React, { Component } from 'react';
import IntroScreen from './IntroScreen';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';

class Sandbox extends Component {
  render() {
    const { loaded, types } = this.props;

    if (!loaded) return null;

    if (loaded && types.length === 0) {
      return <IntroScreen />;
    } else {
      return <Redirect to={`/sandbox/types/${types[0].id}`} />;
    }
  }
}

const mapStateToProps = state => ({ loaded: state.sandbox.loaded, types: state.sandbox.types });

export default connect(mapStateToProps)(Sandbox);
