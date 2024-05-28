import ButtonIcon from 'components/general/ButtonIcon';
import SvgRender from 'components/general/SvgRender';
import React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import Container from '../MediaContainer';
import RecentBitTypes from './RecentBitTypes';
import Upload from './Upload';

const Menu = ({ active_folder, next, onSelectType }) => (
  <Container>
    <div
      className="btn dropdown-item btn-dropdown-icon btn-change-icon btn-arrow-back-icon border-bottom"
      onClick={() => next('folder')}
    >
      <ButtonIcon icon="folder">
        <Title>Folder</Title>
      </ButtonIcon>
    </div>
    <div
      className="btn dropdown-item btn-dropdown-icon btn-bit-icon btn-arrow-back-icon btn-change-icon"
      onClick={() => next('bit-1')}
    >
      <SvgRender
        path={require('assets/svg/general/bit_solid.svg')}
        style={{ height: 16, width: 24 }}
        wrapperClassName="pr-1"
      />
      <Title>Bit</Title>
    </div>
    <RecentBitTypes
      onSelect={id => {
        onSelectType(id);
        next('bit-1');
      }}
    />
    <Seperator />
    <Upload />
  </Container>
);

export default connect(state => ({ active_folder: state.folders.active }))(Menu);

const Seperator = styled('div')`
  border: 1px solid #e6f0f7;
  margin: 0.5rem 0;
`;

const Title = styled('div')`
  font-size: 14px;
`;
