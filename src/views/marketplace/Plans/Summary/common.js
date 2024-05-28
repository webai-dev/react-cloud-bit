import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export const Title = styled('div')`
  font-size: 16px;
  font-weight: 600;

  margin: ${variables.size32} 0;
`;

export const Checkrow = styled('ul')`
  margin: 0;
  padding: 0;

  li {
    font-size: ${variables.size14};
    list-style-type: none;
    margin-bottom: ${variables.size16};
    padding: 0.25em 0 0 ${variables.size24};
    position: relative;

    display: flex;
    align-items: center;

    &:before {
      content: ' ';
      display: block;
      border: solid ${variables.size8} ${variables.main};
      border-radius: ${variables.size8};
      height: 0;
      width: 0;
      position: absolute;
      left: 0px;
      top: 12px;
      margin-top: -0.5em;
    }

    &:after {
      transform-origin: left top;
      border-right: 2px solid white;
      border-top: 2px solid white;
      content: '';
      display: block;
      height: 9px;
      left: 3px;
      position: absolute;
      top: 13px;
      width: 5px;
      transform: scaleX(-1) rotate(135deg);
    }
  }
`;
