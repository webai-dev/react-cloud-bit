import AccountWizard from 'views/user/AccountWizard';
import AccountInvitations from 'views/user/AccountInvitations';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    base: true,
    path: '/profile/invitations',
    component: AccountInvitations
  },
  {
    type: 'private',
    exact: true,
    app: true,
    base: true,
    path: '/profile',
    component: AccountWizard
  }
];
