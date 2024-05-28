import Marketplace from './index';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/marketplace/bits/:category?',
    component: Marketplace
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/marketplace/plans',
    component: Marketplace
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/marketplace/invoices',
    component: Marketplace
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/marketplace/payments',
    component: Marketplace
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/marketplace/contact',
    component: Marketplace
  }
];
