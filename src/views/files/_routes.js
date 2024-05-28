import FolderInner from 'views/folders/FolderInner';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    team: true,
    path: '/file/:file_id',
    component: FolderInner
  }
];
