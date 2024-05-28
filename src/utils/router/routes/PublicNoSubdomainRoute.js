import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { teamSubdomain } from 'utils/variables';
import Main from 'components/public/Main';

const PublicNoSubdomainRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      return teamSubdomain() !== '' ? (
        <Redirect
          to={{
            pathname: '/404',
            state: { from: props.location }
          }}
        />
      ) : (
        <Main>
          <Component {...props} />
        </Main>
      );
    }}
  />
);

export default PublicNoSubdomainRoute;
