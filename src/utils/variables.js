export const domain_parts = window.location.hostname.split('.');
const findIndex = () => {
  let index = domain_parts.findIndex(p => p === 'ybit' || p === 'localhost');
  if (index !== -1) return index;
  else {
    index = domain_parts.findIndex(p => p === 'local');
    if (index !== -1) return index - 1;
    else return -1;
  }
};

const index = findIndex();

export const baseDomain = () => {
  let base = '';

  if (index !== -1) {
    for (let i = index; i <= domain_parts.length - 1; i++) {
      base = base + (i !== index ? '.' : '') + domain_parts[i];
    }

    if (domain_parts[index - 1] && domain_parts[index - 1] === 'dev') {
      base = 'dev.' + base;
    }
  }

  return base;
};

export const teamSubdomain = () => {
  return domain_parts[index - 1] !== undefined
    ? domain_parts[index - 1] === 'dev'
      ? domain_parts[index - 2] !== undefined
        ? domain_parts[index - 2]
        : ''
      : domain_parts[index - 1]
    : '';
};
