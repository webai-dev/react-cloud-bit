import Sandbox from './index';
import CreateType from './types/CreateType';
import EditType from './types/EditType';
import Type from './types';
import Instance from './instances/Instance';

export default [
    {
        type: 'private',
        exact: true,
        app: true,
        sandbox: true,
        team: true,
        fullscreen: false,
        path: '/sandbox',
        component: Sandbox
    },
    {
        type: 'private',
        exact: true,
        app: true,
        sandbox: true,
        team: true,
        fullscreen: false,
        path: '/sandbox/types/new',
        component: CreateType
    },
    {
        type: 'private',
        exact: true,
        app: true,
        sandbox: true,
        team: true,
        fullscreen: false,
        path: '/sandbox/types/:typeId',
        component: Type
    },
    {
        type: 'private',
        exact: true,
        app: true,
        sandbox: true,
        team: true,
        fullscreen: false,
        path: '/sandbox/types/:typeId/edit',
        component: EditType
    },
    {
        type: 'private',
        exact: true,
        app: true,
        sandbox: true,
        team: true,
        fullscreen: false,
        path: '/sandbox/types/:typeId/instances/:instanceId',
        component: Instance
    }
];
