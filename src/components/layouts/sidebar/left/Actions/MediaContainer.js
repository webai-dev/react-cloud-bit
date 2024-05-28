import React from 'react';
import styled from 'react-emotion';
import { Scrollbar } from 'utils/styles/scrollbar';

export const Container = props => (
  <ContainerStyle {...props} className={Scrollbar}>
    {props.children}
  </ContainerStyle>
);
export default Container;

const ContainerStyle = styled('div')`
  @media (max-height: 768px) {
    overflow-y: auto;
    height: 380px;
  }
`;
