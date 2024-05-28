import React from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

const Section = ({ title, children }) => (
  <Wrapper>
    <Title>{title}</Title>
    {children}
  </Wrapper>
);
export default Section;

const Wrapper = styled('div')`
  margin: ${variables.size16} ${variables.size24};
`;
const Title = styled('div')`
  font-size: ${variables.size12};
  color: #c2c2c2;
  margin-bottom: ${variables.size12};
`;
