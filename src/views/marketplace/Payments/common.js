import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export const Container = styled('div')`
  background: white;
  border: 1px solid #e1e7ee;
  border-radius: 3px;

  width: 346px;
  height: 182px;

  padding: ${variables.size24};

  position: relative;

  .slider {
    width: 344px;
    display: flex;
    align-items: center;

    position: absolute;
    top: 0;
    left: 0;
    background: white;
    overflow-y: hidden;

    height: 0;

    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
  }

  &:hover {
    .slider {
      height: 180px;
    }
  }

  cursor: pointer;
`;

export const Button = styled('div')`
  flex-grow: 1;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;

  font-size: ${variables.size16};
  font-weight: 600;

  color: ${variables.main};
  background: white;

  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: linear;

  &:hover {
    color: white;
    background: ${variables.main};
  }

  cursor: pointer;
`;
