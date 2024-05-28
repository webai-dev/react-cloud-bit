import React from 'react';
import ReactDOM from 'react-dom';

import 'react-dates/initialize';
import 'assets/sass/main.scss';
import 'utils/modernizr/modernizr';
import '@brainhubeu/react-carousel/lib/style.css';

import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import browserHistory from 'utils/history';
import store from 'utils/store';
import AppRouter from 'utils/router';
import { setupResponseInterceptors } from 'utils/api';

import { initializeFirebaseApp } from 'utils/firebase';
import Bugsnag from 'components/layouts/Bugsnag';

syncHistoryWithStore(browserHistory, store);
setupResponseInterceptors(store);
initializeFirebaseApp();

ReactDOM.render(
  <Provider store={store}>
    <Bugsnag>
      <AppRouter history={browserHistory} />
    </Bugsnag>
  </Provider>,
  document.getElementById('root')
);
