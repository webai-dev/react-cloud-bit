import React from 'react';

import Navigation from './Navigation';
import Menu from './Menu';

const HeaderMain = props => {
  const Type = props.menu ? Menu : Navigation;
  return <Type {...props} />;
};

export default HeaderMain;
