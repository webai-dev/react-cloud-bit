import React from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

const Button = ({ onClick, children, className, ...rest }) => (
  <Container
    className={'btn btn-main btn-dropdown-icon d-flex align-items-center ' + className || ''}
    onClick={onClick}
  >
    {children}
  </Container>
);
export default Button;

const Container = styled('button')`
  color: white !important;
  background-color: ${variables.main};
`;
