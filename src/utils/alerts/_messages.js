export default {
  //Bits
  BIT_CREATED: bitName => `"${bitName}" was created`,
  BIT_UPDATED: 'Bit updated',
  BIT_DELETED: 'Bit deleted',
  BIT_MOVED: 'Bit moved',
  BIT_DELETE_PREVENTION_TITLE: fileName => `Delete ${fileName}`,
  BIT_DELETE_PREVENTION_TEXT: 'You are about to delete a bit. Are you sure you want to continue?',

  //Folders
  FOLDER_CREATED: folderName => `${folderName} created`,
  FOLDER_DELETED: 'Folder deleted',
  FOLDER_UPDATED: 'Folder updated',
  FOLDER_MOVED: 'Folder moved',
  FOLDER_DELETE_PREVENTION_TITLE: fileName => `Delete ${fileName}`,
  FOLDER_DELETE_PREVENTION_TEXT:
    'You are about to delete a folder. <br> Are you sure you want to continue?',

  //File
  FILE_CREATED: fileName => `${fileName} created`,
  FILE_UPDATED: 'File updated',
  FILE_DELETED: 'File deleted',
  FILE_COPIED: 'File copied',
  FILE_MOVED: 'File moved',
  FILE_REPLACED: 'File replaced',
  FILE_DELETE_PREVENTION_TITLE: fileName => `Delete ${fileName}`,
  FILE_DELETE_PREVENTION_TEXT: 'You are about to delete a file. Are you sure you want to continue?',
  FILE_VERSION_UPDATED: 'Version updated',
  FILE_VERSION_DELETED: 'Version deleted',
  //Shares
  SHARE_CREATED: 'Share created',
  SHARE_UPDATED: 'Share updated',
  SHARE_ACCESS_REMOVED: 'Share access removed',
  UNSHARED_WITH_EVERYONE: 'Unshared with everyone',
  PUBLIC_LINK_SENT: 'Sent email with the public link',
  INVALID_EMAIL: 'The email addresses entered are not valid',
  SHARE_REMOVE_PREVENTION_TITLE: fileName => `Remove ${fileName} from shared`,
  SHARE_REMOVE_PREVENTION_TEXT: type =>
    `You are about to remove this ${type} from your shared. You will lose any related shortcuts from your tree. Are you sure you want to continue?`,

  //Shortcuts
  SHORTCUT_REMOVE_PREVENTION_TITLE: fileName => `Remove ${fileName}`,
  SHORTCUT_REMOVE_PREVENTION_TEXT: type =>
    `You are about to remove this ${type} from your tree. You will still see it in your shared with me folder. Are you sure you want to continue?`,

  //Bulk
  BULK_DOWNLOAD_STARTS_SOON: {
    title: 'Download starts soon',
    message: 'We compress all selected assets'
  },
  BULK_MOVING: 'Moving items...',
  BULK_MOVED: 'Items moved',
  BULK_DELETING: 'Deleting items...',
  BULK_DELETED: 'Items deleted',
  BULK_SHARE_REMOVE_PREVENTION_TITLE: `Remove selected items from shared`,
  BULK_SHARE_REMOVE_PREVENTION_TEXT: `You are about to remove the selected items from shared.<br /> Are you sure you want to continue?`,
  BULK_DELETE_PREVENTION_TITLE: `Delete selected items`,
  BULK_DELETE_PREVENTION_TEXT: `You are about to delete the selected items.<br /> Are you sure you want to continue?`,

  // Shortcuts
  CREATE_SHORTCUT_SUCCESS: 'Shortcut created',
  MOVE_SHORTCUT_SUCCESS: 'Shortcut moved',
  DELETE_SHORTCUT_SUCCESS: 'Shortcut deleted',

  //Teams
  TEAM_CREATED: teamName => `${teamName} created`,
  TEAM_UPDATED: 'Team updated',
  TEAM_DELETED: 'Team deleted',
  TEAM_LEFT: 'You left this team',
  NOT_IN_TEAM: 'You are not authorized to view this team',
  TEAM_OWNERSHIP_TRANSFERED: 'Ownership was transfered successfully',

  //Members
  MEMBER_REMOVED: 'Member removed',
  MEMBER_ROLE_UPDATED: 'Member role updated',
  MEMBER_DEV_ROLE_UPDATED: 'Member developer role updated',

  //Invitations
  INVITATION_ACCEPTED: 'Invitation accepted',
  INVITATION_DECLINED: 'Invitation declined',
  INVITATION_DELETED: 'Invitation deleted',
  INVITATION_SENT: 'Invitations have been sent',

  //Users
  USER_ACCOUNT_UPDATED: 'Account updated',
  USER_SYNC_SUCCESS: 'Sync successful',
  USER_DELETED: 'User Has Been Deleted',

  //Dashboard
  BIT_ADDED_TO_DASH: 'Bit added to dashboard',
  FILE_ADDED_TO_DASH: 'File added to dashboard',
  BIT_REMOVED_FROM_DASH: 'Bit removed from dashboard',
  FILE_REMOVED_FROM_DASH: 'File removed from dashboard',

  //Pinboard
  PIN_CREATED: 'Pin created',
  PIN_UPDATED: 'Pin updated',
  PIN_FAVOURITES_UPDATED: 'Pinboard favourites updated',
  PIN_DELETED: 'Pin deleted',

  //Apparatus
  APPARATUS_LINK_SUCCESS: 'A magic link has been send to your email.',
  APPARATUS_LOGIN_ERROR: { data: { error: 'error', message: 'An error has occurred.' } },
  APPARATUS_ERROR: 'Failed to load QR code. Try sending a Login link to your email.',
  APPARATUS_MAGIC_LINK_ERROR: 'Failed to login. Try sending a new Login link to your email.',

  //Filters
  FILTER_SAVE: 'Filter options updated',

  //Copy
  COPY_URL: `URL copied to clipboard.`,

  //marketplace
  MARKETPLACE_ACCESS: 'You dont have the right permission to access marketplace',

  //router
  FORBIDDEN_ROUTE: 'You are not authorized to see this section',

  //Sandbox
  TYPE_CREATED: 'Bit type successfully created',
  TYPE_EDITED: 'Bit type successfully edited',
  TYPE_DELETED: 'Bit type successfully deleted'
};
