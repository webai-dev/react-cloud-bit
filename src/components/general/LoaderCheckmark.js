import React, { Component } from 'react';
import styled, { keyframes, css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export class LoaderCheckmark extends Component {
  render() {
    return (
      <CircleLoader className={this.props.complete === true ? 'complete' : ''}>
        <div className={`draw checkmark ${Checkmark}`} />
      </CircleLoader>
    );
  }
}

export default LoaderCheckmark;

const loaderDefaults = {
  success: variables.main,
  size: 16
};

const checkmarkDefaults = {
  height: loaderDefaults.size / 2,
  width: loaderDefaults.size / 4,
  left: loaderDefaults.size / 6 + loaderDefaults.size / 12,
  thickness: 2,
  color: variables.main
};

const loaderSpin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const checkmark = keyframes`
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: ${checkmarkDefaults.width}px;
    opacity: 1;
  }
  40% {
    height: ${checkmarkDefaults.height}px;
    width: ${checkmarkDefaults.width}px;
    opacity: 1;
  }
  100% {
    height: ${checkmarkDefaults.height}px;
    width: ${checkmarkDefaults.width}px;
    opacity: 1;
  }
`;

const CircleLoader = styled('div')`
  border: 2px solid transparent;
  border-left-color: ${loaderDefaults.success};
  border-top-color: ${loaderDefaults.success};
  animation-name: ${loaderSpin};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
  width: 16px;
  height: 16px;

  &.complete {
    -webkit-animation: none;
    animation: none;
    border-color: ${loaderDefaults.success};
    transition: border 500ms ease-out;

    .checkmark {
      display: block;
    }
  }
`;

const Checkmark = css`
  &.checkmark {
    display: none;

    &.draw:after {
      animation-duration: 800ms;
      animation-timing-function: ease;
      animation-name: ${checkmark};
      transform: scaleX(-1) rotate(135deg);
    }

    &:after {
      opacity: 1;
      height: ${checkmarkDefaults.height}px;
      width: ${checkmarkDefaults.width}px;
      transform-origin: left top;
      border-right: 2px solid ${checkmarkDefaults.color};
      border-top: 2px solid ${checkmarkDefaults.color};
      content: '';
      left: 2px;
      top: 7px;
      position: absolute;
    }
  }
`;
