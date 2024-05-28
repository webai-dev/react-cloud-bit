import axios from 'axios';
import qs from 'qs';
import { introRedirect } from 'utils/redirect';
import { loadState, deleteCookie } from 'utils/storage';
import * as TYPES from 'views/auth/_types';
import * as USERTYPES from 'views/user/_types';

const API_URL = process.env.REACT_APP_API_URL;
let httpMock = null;
let MockAdapter;

if (process.env.NODE_ENV === 'test') {
  MockAdapter = MockAdapter = require('axios-mock-adapter');
  httpMock = new MockAdapter(axios);
}

const state = loadState();
let token = null;

if (state && state.auth && state.auth.token) {
  if (state.auth.token) token = state.auth.token;
}

axios.defaults.headers.common.Accept = 'application/json';
setToken(token);

// Interceptors -----------------------------------------
const service = axios.create({
  baseURL: API_URL
});

const blobService = axios.create({
  baseURL: API_URL,
  responseType: 'blob'
});

const apiServices = [service, blobService];

// ----- Before
service.interceptors.request.use(
  config => {
    config.paramsSerializer = params => {
      return qs.stringify(params, {
        arrayFormat: 'brackets'
      });
    };
    return config;
  },
  () => {
    return Promise.reject();
  }
);

// ----- After
export function setupResponseInterceptors(store) {
  // Add a response interceptor
  apiServices.forEach(s => {
    s.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        if (error && error.response && error.response.status) {
          switch (error.response.status) {
            case 401:
              switch (error.response.data.error) {
                case 'token_expired':
                  store.dispatch({ type: TYPES.UNAUTH_USER });
                  store.dispatch({ type: USERTYPES.FETCH_USER_ERROR });
                  deleteCookie('token');
                  break;
                default:
                  break;
              }

              break;
            case 400:
              switch (error.response.data.error) {
                case 'token_invalid':
                case 'token_not_provided':
                  store.dispatch({ type: TYPES.UNAUTH_USER });
                  store.dispatch({ type: USERTYPES.FETCH_USER_ERROR });
                  deleteCookie('token');
                  break;
                default:
                  break;
              }

              break;
            case 404:
              switch (error.response.data.error) {
                case 'EntityNotFound':
                  introRedirect();
                  break;
                default:
                  break;
              }

              break;
            default:
              return Promise.reject(error.response);
          }

          return Promise.reject(error.response);
        } else {
          return Promise.reject(error);
        }
      }
    );
  });
}
// ------------------------------------------------------

// Instance -------------------------------------------
export const apiService = service;
export const apiBlobService = blobService;
export const mock = httpMock;

export function setToken(token) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}
