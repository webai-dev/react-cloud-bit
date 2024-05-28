import React from 'react';

import styled, { keyframes } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

const LoadingPage = ({ loading }) => {
  return (
    <Loader
      className={`align-items-center justify-content-center flex-column ${
        loading ? 'd-flex' : 'd-none'
      }`}
    >
      <div className="la-ball-scale-ripple-multiple">
        <div />
        <div />
        <div />
      </div>
    </Loader>
  );
};

export default LoadingPage;

const ballScaleRippleMultiple = keyframes`
   0% {
      opacity: 1;
      transform: scale(0.1)
  }
  70% {
      opacity: .5;
      transform: scale(1)
  }
  95% {
      opacity: 0
  }
`;

const Loader = styled('div')`
  .la-ball-scale-ripple-multiple,
  .la-ball-scale-ripple-multiple > div {
    position: relative;
    box-sizing: border-box;
  }

  .la-ball-scale-ripple-multiple {
    display: block;
    font-size: 0;
    color: #fff;
    width: 80px;
    height: 80px;
    color: ${variables.main};

    > div {
      display: inline-block;
      float: none;
      background-color: currentColor;
      border: 0 solid currentColor;
      position: absolute;
      top: 0;
      left: 0;
      width: 80px;
      height: 80px;
      background: transparent;
      border-width: 2px;
      border-radius: 100%;
      opacity: 0;
      animation: ${ballScaleRippleMultiple} 1.25s 0s infinite cubic-bezier(0.21, 0.53, 0.56, 0.8);
    }
  }

  .la-ball-scale-ripple-multiple > div:nth-child(1) {
    animation-delay: 0s;
  }

  .la-ball-scale-ripple-multiple > div:nth-child(2) {
    animation-delay: 0.25s;
  }

  .la-ball-scale-ripple-multiple > div:nth-child(3) {
    animation-delay: 0.5s;
  }
`;
