import Login from 'views/auth/Login';
import AfterLogin from 'views/auth/AfterLogin';
import Logout from 'views/auth/Logout';

export default [
  {
    type: 'no_auth',
    exact: true,
    path: '/login-internal/:token',
    component: Login
  },
  {
    type: 'no_auth',
    exact: true,
    path: '/login/:token',
    component: Login
  },
  {
    type: 'no_auth',
    path: '/login',
    exact: true,
    component: Login
  },
  {
    type: 'private',
    exact: true,
    path: '/intro',
    base: true,
    component: AfterLogin
  },
  {
    type: 'private',
    path: '/logout',
    exact: true,
    component: Logout
  }
];
