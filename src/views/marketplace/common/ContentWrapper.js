import React from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export const ContentWrapper = ({ renderFilters, children }) => (
  <div>
    <Top />
    {children}
  </div>
);
export default ContentWrapper;

const Top = styled('div')`
  padding-bottom: ${variables.size24};

  display: flex;
  align-items: center;

  color: ${variables.head}!important;
  font-size: ${variables.size14};

  border-bottom: 1px solid ${variables.disabled};
  margin-bottom: ${variables.size32};
`;
