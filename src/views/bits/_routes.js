import FolderInner from 'views/folders/FolderInner';
import CreateTypeWizard from 'views/folders/CreateTypeWizard';
import BitFullscreen from './BitFullscreen';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/bit/:bit_id/edit',
    component: CreateTypeWizard
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    fullscreen: true,
    path: '/bit/:bit_id/full',
    component: BitFullscreen
  },
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/bit/:bit_id',
    component: FolderInner
  }
];
