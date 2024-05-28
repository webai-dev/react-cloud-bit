import foldersState from 'utils/store/tests/folders';
import teamsState from 'utils/store/tests/teams';
import userState from 'utils/store/tests/user';
import authState from 'utils/store/tests/auth';

export default {
  folders: foldersState,
  teams: teamsState,
  user: userState,
  auth: authState,
  invitations: { list: [] }
};
