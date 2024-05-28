import React from 'react';
import styled, { keyframes } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export const Container = styled('div')`
  display: flex;
  align-items: center;

  padding-bottom: 4px;
  padding-top: 4px;

  cursor: pointer;

  padding-left: ${props => props.depth * 16}px;

  &.selected {
    background-color: ${variables.disabled};
  }

  .icon.shared-with-me {
    path:first-child {
      fill: ${variables.secondary} !important;
    }
  }

  &:hover,
  &.selected {
    .icon {
      path:first-child {
        fill: ${variables.main} !important;
      }
    }
    .file-icon {
      path:first-child {
        fill: #c6c6c6 !important;
      }
    }
  }

  &.disabled {
    color: ${variables.secondary};
    cursor: not-allowed;
  }
`;
const dotAnimation = keyframes`
0%,
20% {
  color: rgba(0, 0, 0, 0);
  text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
}
40% {
  color: white;
  text-shadow: 0.25em 0 0 rgba(0, 0, 0, 0), 0.5em 0 0 rgba(0, 0, 0, 0);
}
60% {
  text-shadow: 0.25em 0 0 white, 0.5em 0 0 rgba(0, 0, 0, 0);
}
80%,
100% {
  text-shadow: 0.25em 0 0 white, 0.5em 0 0 white;
}
`;

const Dot = styled('div')`
  &:after {
    content: ' .';
    animation: ${dotAnimation} 1s steps(5, end) infinite;
    animation-delay: ${props => props.delay};
  }
`;

export const Loader = () => (
  <div className="d-flex mx-1">
    <Dot delay="0s" />
    <Dot delay=".2s" />
    <Dot delay=".4s" />
  </div>
);
