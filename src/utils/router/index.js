import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import Notifications from 'components/general/Notifications';

import ContentWrapper from 'components/layouts/ContentWrapper';

import Home from 'views/Home';
import NotFound from 'views/errors/NotFound';

import RenderRoute from 'utils/router/routes';

import authRoutes from 'views/auth/_routes';
import userRoutes from 'views/user/_routes';
import pinboardRoutes from 'views/pinboard/_routes';
import dashboardRoutes from 'views/dashboard/_routes';
import foldersRoutes from 'views/folders/_routes';
import filesRoutes from 'views/files/_routes';
import bitsRoutes from 'views/bits/_routes';
import teamsRoutes from 'views/teams/_routes';
import settingsRoutes from 'views/settings/_routes';
import legalRoutes from 'views/legal/_routes';
import marketplaceRoutes from 'views/marketplace/_routes';
import sandboxRoutes from 'views/sandbox/_routes';

import DownloadFile from 'views/files/DownloadFile';

const mergedRoutes = [
  ...authRoutes,
  ...userRoutes,
  ...pinboardRoutes,
  ...dashboardRoutes,
  ...foldersRoutes,
  ...filesRoutes,
  ...bitsRoutes,
  ...teamsRoutes,
  ...settingsRoutes,
  ...legalRoutes,
  ...marketplaceRoutes,
  ...sandboxRoutes
];

class AppRouter extends Component {
  render() {
    return (
      <Router history={this.props.history}>
        <ContentWrapper>
          <Switch>
            {mergedRoutes.map((route, i) => (
              <RenderRoute authenticated={this.props.authenticated} key={i} {...route} />
            ))}

            <RenderRoute
              type="landing"
              exact
              path="/"
              authenticated={this.props.authenticated}
              component={Home}
            />

            <Route exact path="/files/:token" component={DownloadFile} />
            <Route path="/404" component={NotFound} />
            <Route component={NotFound} />
          </Switch>
          <Notifications />
        </ContentWrapper>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    active_team: state.teams.active
  };
}

export default connect(
  mapStateToProps,
  {}
)(AppRouter);
