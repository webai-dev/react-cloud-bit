import React from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

const items = {
  bit: 'Bit',
  folder: 'Folder',
  file: 'File'
};

const ActivityDescription = ({ user, action, mode, changes, metadata }) => {
  const getTitleAfter = changes => {
    if (changes === undefined) {
      return '';
    }
    const a = JSON.parse(changes);
    return a.title.after;
  };

  const getFolderAfter = changes => {
    if (changes === undefined) {
      return '';
    }
    const a = JSON.parse(changes);
    return a.folder_name.after;
  };

  const getOriginalFilename = data => {
    if (data === undefined) {
      return '';
    }
    const a = JSON.parse(data);
    return a.original_filename;
  };

  const getSharedUser = data => {
    if (data === undefined) {
      return '';
    }
    const a = JSON.parse(data);
    return a.user_name;
  };

  const getRightFunction = (action, changes, metadata) => {
    switch (action) {
      case 'rename':
        return getTitleAfter(changes);
        break;
      case 'move':
        return <span className="blue">{getFolderAfter(changes)}</span>;
        break;
      case 'edit':
        return '';
        break;
      case 'share_add':
        return <span>{getSharedUser(metadata)}</span>;
      case 'share_edit':
        return <span>{getSharedUser(metadata)}</span>;
        break;
      case 'upload':
        return getOriginalFilename(metadata);
        break;
      case 'reupload':
        return getOriginalFilename(metadata);
        break;
      case 'create':
        return '';
        break;
      case 'copy':
        return '';
        break;

      default:
        break;
    }
  };

  const actionMapping = {
    rename: ` renamed ${mode} to`,
    replace: `replaced ${mode}`,
    move: ` moved the ${mode} to folder`,
    upload: `uploaded ${mode}`,
    create: `${items[mode]} created ${user ? 'by ' : ''}`,
    share_add: `shared the ${mode} with`,
    share_edit: `shared the ${mode} with`,
    edit: `${items[mode]} edited ${user ? 'by ' : ''}`,
    copy: `copied ${mode}`,
    reupload: `replaced ${mode}`,
    change: `changed ${mode}`,
    download: `downloaded ${mode}`,
    open: `opened ${mode}`
  };

  return (
    <SingleAction>
      {action === 'create' || action === 'edit' ? (
        <div>
          {actionMapping[action]} <span>{user? user.name: null}</span>
        </div>
      ) : (
        <div>
          <span>{user? user.name: null}</span> {actionMapping[action]} {getRightFunction(action, changes, metadata)}

        </div>
      )}
    </SingleAction>
  );
};

const SingleAction = styled('div')`
  font-size: ${variables.size14};
  font-weight: 300;
`;

export default ActivityDescription;
