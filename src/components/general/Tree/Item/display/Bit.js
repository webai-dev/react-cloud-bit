import React from 'react';
import SvgRender from 'components/general/SvgRender';
import { Container } from './common';

const Bit = ({ title, selected, disabled, depth, onClick }) => (
  <Container
    className={`${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} pr-3`}
    depth={depth}
    onClick={() => !disabled && onClick()}
  >
    <Icon />
    {title}
  </Container>
);
export default Bit;

const Icon = () => (
  <SvgRender
    style={{
      width: 16,
      height: 16,
      marginRight: 8
    }}
    className={'icon'}
    path={require('assets/svg/general/bit_solid.svg')}
  />
);
