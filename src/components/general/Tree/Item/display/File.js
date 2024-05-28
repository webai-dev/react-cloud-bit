import React from 'react';
import SvgRender from 'components/general/SvgRender';
import { icon } from 'utils/files';
import { Container } from './common';

const File = ({ title, mime_type, extension, selected, disabled, depth, onClick }) => (
  <Container
    className={`${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} pr-3`}
    depth={depth}
    onClick={() => !disabled && onClick()}
  >
    <Icon mime_type={mime_type} extension={extension} />
    {title}
  </Container>
);
export default File;

const Icon = ({ mime_type, extension }) => (
  <SvgRender
    style={{
      width: 16,
      height: 16,
      marginRight: 8
    }}
    className={'file-icon'}
    path={icon(mime_type, extension)}
  />
);
