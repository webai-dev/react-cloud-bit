import DashboardIndex from 'views/dashboard/DashboardIndex';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/dashboard',
    component: DashboardIndex
  }
];
