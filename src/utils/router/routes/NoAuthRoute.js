import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const NoAuthRoute = ({ component, ...rest }) => (
  <Route
    exact
    {...rest}
    render={props =>
      !rest.authenticated ? (
        React.createElement(component, props)
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default NoAuthRoute;
