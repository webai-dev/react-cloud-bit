import React from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import Section from './Section';
import Types from './Types';
import Owners from './Owners';

const Dropdown = ({
  isOpen,
  teammates,
  isFetchingTeamates,
  addSpecial,
  removeSpecial,
  selectedTypes,
  selectedOwner
}) => {
  return (
    <Container isOpen={isOpen}>
      <Section title="Match my search with type:">
        <Types
          onAdd={addSpecial('type')}
          onRemove={removeSpecial('type')}
          selected={selectedTypes}
        />
      </Section>
      <Section title="Match my search with owner:">
        <Owners
          teammates={teammates}
          loading={isFetchingTeamates}
          onAdd={addSpecial('owner')}
          onRemove={removeSpecial('owner')}
          selected={selectedOwner}
        />
      </Section>
    </Container>
  );
};
export default Dropdown;

const Container = styled('div')`
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0%)' : 'translateY(-2em)')};

  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  width: 100%;

  overflow-y: auto;
  padding-bottom: ${variables.size8};

  background-color: #fff;
  background-clip: padding-box;
  border-radius: 0 0 3px 3px;
  box-shadow: 4px 6px 32px -3px #9e9e9e;

  transition: all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s;
  transition-delay: 0s, 0s, 0.3s;
`;
