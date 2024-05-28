import Bits from 'views/settings/bits';
import Team from 'views/settings/team';
import ApiKeys from 'views/settings/apiKeys';
import TeammatesInvitationsWizard from 'views/teammates/TeammatesInvitationsWizard';
import TeammatesInvitations from 'views/teammates/TeammatesInvitations';
import TeammatesIndex from 'views/teammates/TeammatesIndex';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/settings/users/invite',
    forbiddenRoles: ['guest'],
    component: TeammatesInvitationsWizard
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/settings/users/invitations',
    forbiddenRoles: ['guest'],
    component: TeammatesInvitations
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/settings/users/teammates',
    forbiddenRoles: ['guest'],
    component: TeammatesIndex
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/settings/bits',
    forbiddenRoles: ['guest'],
    component: Bits
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/settings/team',
    forbiddenRoles: ['guest'],
    component: Team
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/settings/api_keys',
    forbiddenRoles: ['guest'],
    component: ApiKeys
  }
];
