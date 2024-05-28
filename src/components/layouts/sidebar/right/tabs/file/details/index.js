import React, { Fragment } from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import Preview from './Preview';
import SharedWith from './SharedWith';
import InfoTable from './InfoTable';
import Versions from './Versions';

import { Scrollbar } from 'utils/styles/scrollbar';

const Details = props => (
  <Fragment>
    {props.withPreview && <Preview {...props} />}
    <MainContainer className={Scrollbar} withPreview={props.withPreview}>
      <InfoContainer>
        <SharedWith {...props} />
        <InfoTable {...props} />
      </InfoContainer>
      {props.mode === 'file' && <Versions {...props} />}
    </MainContainer>
  </Fragment>
);
export default Details;

const MainContainer = styled('div')`
  flex: 1;
  overflow-y: auto;
  padding-right: ${variables.size8};
  margin-right: ${variables.size8};
`;

const InfoContainer = styled('div')`
  margin: 0 ${variables.size32};
`;
