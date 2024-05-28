import * as TYPES from './_types';

export function toggleSidebarVisibility(activeTab, data = {}) {
  return { type: TYPES.SIDEBAR_VISIBILITY_CHANGE, payload: { activeTab, data } };
}

export function hideSidebar() {
  return { type: TYPES.HIDE_SIDEBAR, payload: {} };
}

export const toggleDetails = (fileId, mode) => ({
  type: TYPES.TOGGLE_DETAILS,
  payload: { fileId, mode }
});
