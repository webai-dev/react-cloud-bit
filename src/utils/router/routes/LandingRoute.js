import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { teamSubdomain } from 'utils/variables';
import App from 'components/layouts/App';
import Main from 'components/public/Main';

const LandingRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return teamSubdomain() !== '' ? (
        rest.authenticated ? (
          <App>
            <Component {...props} />
          </App>
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      ) : (
        <Main>
          <Component {...props} />
        </Main>
      );
    }}
  />
);

export default LandingRoute;
