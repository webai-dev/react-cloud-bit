import React from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import SvgRender from 'components/general/SvgRender';

const Switch = ({ checked, toggle, labels }) => (
  <Container>
    <Label active={!checked}>{labels[0]}</Label>
    <Toggle onClick={toggle}>
      <input type="checkbox" checked={checked} />
      <span className="slider" />
    </Toggle>
    <Label active={checked}>{labels[1]}</Label>
    <SvgRender
      path={require('assets/svg/general/save_10_p.svg')}
      style={{ height: 36, marginTop: -28 }}
    />
  </Container>
);
export default Switch;

const Container = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled('div')`
  margin: 0 ${variables.size14};
  color: ${props => (props.active ? variables.head : variables.secondary)};
  font-weight: ${props => (props.active ? 600 : 300)};
`;

const Toggle = styled('div')`
  position: relative;
  display: inline-block;
  width: 53px;
  height: 33px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    border-radius: 33px;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${variables.head};
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    border-radius: 33px;

    position: absolute;
    content: '';
    height: 29px;
    width: 29px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(19px);
    -ms-transform: translateX(19px);
    transform: translateX(19px);
  }
`;
