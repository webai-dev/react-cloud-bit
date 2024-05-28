import React from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import types from '../typeOptions';
import TypeCard from '../TypeCard';

const Types = ({ selected, onAdd, onRemove }) => (
  <Wrapper>
    {types.map(type => {
      const isSelected = selected.includes(type.id);
      return (
        <TypeCard
          key={type.id}
          {...type}
          selected={isSelected}
          onClick={() => (isSelected ? onRemove(type.id, type.label) : onAdd(type.id, type.label))}
        />
      );
    })}
    <Seperator />
    <TypeCard
      id="file"
      label="All Files"
      icon={require('assets/svg/files/all_files.svg')}
      iconWrapper
      selected={selected.includes('file')}
      onClick={() =>
        selected.includes('file') ? onRemove('file', 'Files') : onAdd('file', 'Files')
      }
    />
  </Wrapper>
);
export default Types;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-around;

  padding-bottom: ${variables.size24};
  border-bottom: 1px solid #e6f0f7;
`;

const Seperator = styled('div')`
  border-right: 1px solid #e6f0f7;
`;
