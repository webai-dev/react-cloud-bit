import { domain_parts } from 'utils/variables';
const domain = !domain_parts.some(part => part === 'localhost')
  ? '.' + domain_parts[domain_parts.length - 2] + '.' + domain_parts[domain_parts.length - 1]
  : '';

export const deleteCookie = cname => {
  document.cookie =
    cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=' + domain + ';';
};

export const setCookie = (cname, cvalue, exdays) => {
  let d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + '; path=/; domain=' + domain + ';';
};

export const loadState = () => {
  let state = {
    auth: {},
    user: {
      id: null,
      role: { label: 'initial' }
    }
  };

  try {
    let c = document.cookie.split('; ');
    let cookies = {};

    for (let i = c.length - 1; i >= 0; i--) {
      let s_c = c[i].split('=');
      cookies[s_c[0]] = s_c[1];
    }

    if (cookies.token) {
      state.auth = {};

      state.auth.token = cookies.token;
      state.auth.authenticated = true;

      if (cookies.after_login) {
        state.auth.after_login = cookies.after_login;
      }

      if (cookies.directive_id) {
        state.auth.directive_id = cookies.directive_id;
      }
    }

    return state;
  } catch (err) {
    return state;
  }
};

export const saveState = state => {
  try {
    if (state.auth && state.auth.token) {
      setCookie('token', state.auth.token, 2);
    }

    if (state.auth && state.auth.after_login) {
      setCookie('after_login', state.auth.after_login, 2);
    }
    if (state.auth && state.auth.directive_id) {
      setCookie('directive_id', state.auth.directive_id, 2);
    }
  } catch (err) {
    // Handle errors
  }
};
