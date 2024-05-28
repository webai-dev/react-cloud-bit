import React, { Component } from 'react';
import styled, { keyframes } from 'react-emotion';

export class Loader extends Component {
  render() {
    return (
      <LoaderBox>
        <span>{'{'}</span>
        <small>{this.props.text}</small>
        <span>{'}'}</span>
      </LoaderBox>
    );
  }
}

export default Loader;

const pulse = keyframes`
  to {
    transform: scale(0.8);
    opacity: 0.6;
  }
`;

const LoaderBox = styled('div')`
  span {
    display: inline-block;
    animation: ${pulse} 0.4s alternate infinite ease-in-out;
    font-weight: 400;
    padding: 0 4px;
    font-family: Consolas, Menlo, Monaco, monospace;

    &:nth-child(odd) {
      animation-delay: 0.4s;
    }
`;
