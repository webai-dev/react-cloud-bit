import React from 'react';
import { Route } from 'react-router-dom';
import Main from 'components/public/Main';

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route
    exact
    {...rest}
    render={props => (
      <Main>
        <Component {...props} />
      </Main>
    )}
  />
);

export default PublicRoute;
