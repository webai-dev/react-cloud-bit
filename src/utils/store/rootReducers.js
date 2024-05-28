import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as alerts } from 'react-notification-system-redux';

import auth from 'views/auth/_reducers';
import bits from 'views/bits/_reducers';
import dashboard from 'views/dashboard/_reducers';
import dropzone from 'components/dropzone/_reducers';
import files from 'views/files/_reducers';
import filters from 'state/filters/_reducers';
import folders from 'views/folders/_reducers';
import invitations from 'views/invitations/_reducers';
import notifications from 'state/notifications/_reducers';
import pinboard from 'views/pinboard/_reducers';
import roles from 'state/roles/_reducers';
import search from 'state/search/_reducers';
import shares from 'views/shares/_reducers';
import sidebar from 'components/layouts/sidebar/right/_reducers';
import teammates from 'views/teammates/_reducers';
import teams from 'views/teams/_reducers';
import user from 'views/user/_reducers';
import marketplace from 'views/marketplace/store/_reducers';
import banner from 'components/layouts/header/Banner/_reducer';
import sandbox from 'views/sandbox/_reducer';

const combinedReducer = combineReducers({
  alerts,
  auth,
  bits,
  dashboard,
  dropzone,
  files,
  filters,
  folders,
  invitations,
  notifications,
  pinboard,
  roles,
  routing,
  search,
  shares,
  sidebar,
  teammates,
  teams,
  user,
  marketplace,
  banner,
  sandbox
});

function rootReducers(state, action) {
  switch (action.type) {
    default:
      return combinedReducer(state, action);
  }
}

export default rootReducers;
