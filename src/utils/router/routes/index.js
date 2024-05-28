import React, { Component } from 'react';

import LandingRoute from './LandingRoute';
import PrivateRoute from './PrivateRoute';
import NoAuthRoute from './NoAuthRoute';
import PublicNoSubdomainRoute from './PublicNoSubdomainRoute';
import PublicRoute from './PublicRoute';

class RenderRoute extends Component {
  components = {
    landing: LandingRoute,
    private: PrivateRoute,
    no_auth: NoAuthRoute,
    public: PublicRoute,
    public_no_subdomain: PublicNoSubdomainRoute
  };

  render() {
    const TagName = this.components[this.props.type || 'public'];
    return <TagName {...this.props} />;
  }
}
export default RenderRoute;
