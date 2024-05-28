import React from 'react';
import { connect } from 'react-redux';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import { ContentWrapper } from '../common';
import BitCard from './BitCard';

const enhance = connect(state => ({
  items: state.bits.types.filter(type => type.background && type.tagline)
}));
const Bits = ({ items }) => (
  <ContentWrapper>
    <RowContainer>
      {items.map(item => (
        <BitCard key={item.id} {...item} />
      ))}
      <MoreComming>More bits comming soon</MoreComming>
    </RowContainer>
  </ContentWrapper>
);
export default enhance(Bits);

const RowContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
`;

const MoreComming = styled('div')`
  background: ${variables.disabled};
  border-radius: 3px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: ${variables.size14};

  width: 230px;
  height: 80px;
`;
