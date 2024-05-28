import Legal from './Legal';

export default [
  {
    type: 'public_no_subdomain',
    path:
      '/legal/:page(privacy-policy|terms-of-service|business-agreement|dmca-policy|acceptable-use|use-of-cookies)',
    exact: true,
    component: Legal
  }
];
