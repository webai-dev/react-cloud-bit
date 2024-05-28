import React from 'react';

import { humanizePercentage } from 'utils/functions';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import { Info, Text, SecondaryText } from './common';

const ProgressRing = ({ percentage }) => (
  <Container>
    <Info className="position-absolute">
      <Text>{humanizePercentage(percentage)}%</Text>
      <SecondaryText>in use</SecondaryText>
    </Info>
    <Svg>
      <BackgroundCircle />
      <ProgressCircle progress={percentage < 1 ? percentage : 1} />
    </Svg>
  </Container>
);
export default ProgressRing;

const Container = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Svg = styled('svg')`
  width: 144px;
  height: 144px;
`;

const circumference = 68 * 2 * Math.PI;
const Circle = styled('circle')`
  fill: transparent;
  stroke-width: 6px;

  r: 68;
  cx: 72;
  cy: 72;
`;

const BackgroundCircle = styled(Circle)`
  stroke: ${variables.disabled};
`;

const ProgressCircle = styled(Circle)`
  stroke: ${props => (props.progress < 0.995 ? variables.main : variables.red)};
  stroke-dasharray: ${circumference} ${circumference};
  stroke-dashoffset: ${props => circumference - props.progress * circumference};

  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
`;
