import React from 'react';

import SvgRender from 'components/general/SvgRender';
import replace from 'assets/svg/actions/replace.svg';
import move from 'assets/svg/actions/move.svg';
import upload from 'assets/svg/actions/upload.svg';
import rename from 'assets/svg/actions/rename.svg';
import create from 'assets/svg/actions/create-reverse.svg';
import share from 'assets/svg/actions/share.svg';
import change from 'assets/svg/actions/change.svg';
import copy from 'assets/svg/actions/copy.svg';
import download from 'assets/svg/actions/download.svg';
import show from 'assets/svg/actions/show.svg';

const actionMapping = {
  rename,
  replace,
  move,
  upload,
  create,
  share_add: share,
  share_edit: share,
  edit: rename,
  copy,
  reupload: replace,
  change,
  download,
  open: show
};

const ActivityIcon = ({ action }) => {
  return actionMapping[action] ? <SvgRender path={actionMapping[action]} /> : null;
};

export default ActivityIcon;
