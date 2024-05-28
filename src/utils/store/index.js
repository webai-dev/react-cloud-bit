import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './rootReducers';
import { saveState, loadState } from 'utils/storage';

const preloadedState = loadState();
const middlewares = [thunkMiddleware];
let store;

if (process.env.NODE_ENV === `development`) {
  const { logger } = require('redux-logger');

  middlewares.push(logger);
} else if (process.env.NODE_ENV === `test`) {
  const configureMockStore = require('redux-mock-store');
  store = configureMockStore(middlewares);
}

const middleWare = applyMiddleware(...middlewares);

const initialState = {
  auth: {
    authenticated: false,
    token: null
  },
  user: {
    id: null,
    role: { label: 'guest' }
  }
};

function configureStore(init = preloadedState) {
  let state = init;

  if (typeof state === 'undefined') {
    state = initialState;
  }
  return createStore(reducers, state, middleWare);
}

if (process.env.NODE_ENV !== 'test') {
  store = configureStore();
  store.subscribe(() => {
    saveState({
      auth: store.getState().auth
    });
  });
}

export default store;
