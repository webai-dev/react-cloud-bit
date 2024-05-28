import { reduce, isArray } from 'lodash';

export const createQueryParams = params => {
  var str = [];
  for (var p in params)
    if (params.hasOwnProperty(p)) {
      str.push(
        (isArray(params[p]) ? encodeURIComponent(p) + '[]' : encodeURIComponent(p)) +
          '=' +
          encodeURIComponent(params[p])
      );
    }
  return str.join('&');
};

export const parseQueryParams = search => {
  if (!search || search.length < 2) return {};

  const a  = decodeURI(search)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"');
  const parsedObj = JSON.parse(
    '{"' +
      a
       +
      '"}'
  );
  return reduce(
    parsedObj,
    (acc, value, key) => {
      key = key.startsWith('?') ? key.slice(1, key.length) : key;

      if (key.endsWith('[]')) {
        key = key.slice(0, key.length - 2);
        value = value
          .split('%2C')
          .map(processValue)
          .filter(value => value);
      } else {
        value = processValue(value);
      }

      return {
        ...acc,
        [key]: value
      };
    },
    {}
  );
};

const processValue = value => {
  if (value === 'null') return null;
  if (value.includes('%3A')) return value.split('%3A').join(':');
  return value;
};
