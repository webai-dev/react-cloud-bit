export default [
  {
    label: 'Bits',
    icon: require('assets/svg/general/bitshop.svg'),
    route: '/marketplace/bits',

    subItems: [
      {
        label: 'Bits already installed',
        icon: require('assets/svg/general/installed.svg'),
        route: '/marketplace/bits/installed'
      }
    ]
  },
  {
    label: 'Plans & storage',
    icon: require('assets/svg/general/plans.svg'),
    route: '/marketplace/plans'
  },
  {
    label: 'Invoices',
    icon: require('assets/svg/general/invoices.svg'),
    route: '/marketplace/invoices'
  },
  {
    label: 'Payment Methods',
    icon: require('assets/svg/general/payment.svg'),
    route: '/marketplace/payments'
  }
];
