import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { errorHandler, MSG } from 'utils/alerts';
import { withRouter, Route, Redirect } from 'react-router-dom';
import { baseDomain } from 'utils/variables';
import { teamSubdomain } from 'utils/variables';
import App from 'components/layouts/App';

const enhance = compose(
  withRouter,
  connect(
    (state, props) => ({
      role: state.user.role.label
    }),
    dispatch => ({ errorHandler: message => errorHandler(dispatch, message) })
  )
);
class PrivateRoute extends Component {
  componentDidMount() {
    this.checkIfRoleIsForbidden();
  }
  componentDidUpdate(prevProps) {
    //when role is retrived
    if (prevProps.role !== this.props.role) {
      this.checkIfRoleIsForbidden();
    }
  }

  checkIfRoleIsForbidden = () => {
    if (this.props.forbiddenRoles && this.props.forbiddenRoles.includes(this.props.role)) {
      this.props.errorHandler({ data: { message: MSG.FORBIDDEN_ROUTE } });
      this.props.history.goBack();
    }
  };

  render() {
    const { component: Component, fullscreen, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          return rest.authenticated ? (
            rest.base && teamSubdomain() !== '' ? (
              window.location.replace(
                `${window.location.protocol}//${baseDomain()}${props.location.pathname}`
              )
            ) : rest.team && teamSubdomain() === '' ? (
              <Redirect
                to={{
                  pathname: '/404',
                  state: { from: props.location }
                }}
              />
            ) : rest.app ? (
              <App fullscreen={fullscreen} sandbox={this.props.sandbox}>
                <Component {...props} />
              </App>
            ) : (
              <Component {...props} />
            )
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        }}
      />
    );
  }
}
export default enhance(PrivateRoute);
