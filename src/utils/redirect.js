import { baseDomain } from 'utils/variables';

export const introRedirect = () => {
  setTimeout(() => {
    window.location.href =
      window.location.protocol +
      '//' +
      baseDomain() +
      (window.location.port ? ':' + window.location.port : '') +
      '/intro';
  }, 1000);
};
