import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logoutUser } from './_actions';
import { firebaseSignOut } from 'state/notifications/_actions';

class Logout extends Component {
  componentWillMount() {
    this.props.firebaseSignOut().then(() => this.props.logoutUser());
  }

  render() {
    return null;
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  { logoutUser, firebaseSignOut }
)(Logout);
