import TeamWizard from 'views/teams/TeamWizard';
import TeammatesInvitationsWizard from 'views/teammates/TeammatesInvitationsWizard';
import SharesIndex from 'views/shares/SharesIndex';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    base: true,
    path: '/create',
    component: TeamWizard
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/invite',
    component: TeammatesInvitationsWizard
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/shared',
    component: SharesIndex
  }
];
