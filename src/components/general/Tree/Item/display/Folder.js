import React from 'react';
import SvgRender from 'components/general/SvgRender';
import { Container, Loader } from './common';

const Folder = ({
  id,
  title,
  is_shared,
  is_shortcut,
  shared,
  expanded,
  selected,
  disabled,
  toggle,
  depth,
  onClick,
  loading
}) => (
  <Container
    className={`${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
    depth={depth}
    onClick={() => !disabled && onClick()}
  >
    <Arrow
      expanded={expanded}
      onClick={e => {
        e.stopPropagation();
        toggle();
      }}
    />
    {id ? (
      <FolderIcon is_shared={is_shared} is_shortcut={is_shortcut} />
    ) : shared ? (
      <ShareWithMeIcon />
    ) : (
      <RootIcon />
    )}
    {title}
    {loading && <Loader />}
  </Container>
);
export default Folder;

const Arrow = ({ expanded, onClick }) => (
  <div onClick={onClick}>
    <SvgRender
      path={require('assets/svg/general/arrow.svg')}
      style={{
        width: 16,
        height: 16,
        marginRight: 8,
        zIndex: 2,
        cursor: 'pointer',
        transform: expanded ? 'none' : 'rotate(-90deg)'
      }}
    />
  </div>
);

const FolderIcon = ({ is_shared, is_shortcut }) => (
  <SvgRender
    style={{
      width: 16,
      height: 16,
      marginRight: 8
    }}
    className={`icon ${is_shared ? 'folder-shared' : ''}`}
    wrapperClassName={is_shortcut ? 'shortcut-icon-small' : ''}
    path={require('assets/svg/general/shared-folder.svg')}
  />
);

const RootIcon = () => (
  <SvgRender
    style={{
      width: 16,
      height: 16,
      marginRight: 8
    }}
    className={`icon`}
    path={require('assets/svg/ybit/root-folder.svg')}
  />
);

const ShareWithMeIcon = () => (
  <SvgRender
    style={{
      width: 16,
      height: 16,
      marginRight: 8
    }}
    className={`icon shared-with-me folder-shared`}
    path={require('assets/svg/general/shared-folder.svg')}
  />
);
