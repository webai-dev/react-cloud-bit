import FolderInner from 'views/folders/FolderInner';
import CreateTypeWizard from 'views/folders/CreateTypeWizard';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/folder/create',
    component: CreateTypeWizard
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/folder/:id',
    component: FolderInner
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/folder/:id/create',
    component: CreateTypeWizard
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/search',
    component: FolderInner
  }
];
