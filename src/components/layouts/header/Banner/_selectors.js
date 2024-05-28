// types
export const types = {
  storageWarning: { value: 'storage_warning', level: 'warn' },
  teamLocked: { value: 'team_locked', level: 'danger' }
};

export const bannerType = state => {
  if (state.teams.active.locked) {
    return types.teamLocked;
  } else if (state.teams.active.storage_percentage >= 0.9) {
    return types.storageWarning;
  } else return null;
};

export const showBanner = state => !!bannerType(state) && !state.banner.dismiss;
