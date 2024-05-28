import PinboardWizard from 'views/pinboard/PinboardWizard';
import PinboardIndex from 'views/pinboard/PinboardIndex';

export default [
  {
    type: 'private',
    exact: true,
    app: true,
    path: '/pinboard',
    component: PinboardIndex
  },
  {
    type: 'private',
    exact: true,
    app: true,
    path: '/pin/create',
    component: PinboardWizard
  },
  {
    type: 'private',
    exact: true,
    app: true,
    path: '/pin/:id',
    component: PinboardWizard
  }
];
