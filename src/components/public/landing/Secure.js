import app_image from 'assets/img/public/app_image.png';
import air_tornado from 'assets/svg/public/air_tornado.svg';
import balloon from 'assets/svg/public/balloon.svg';
import SvgRender from 'components/general/SvgRender';
import Buildings from 'components/public/small/Buildings';
import Cloud from 'components/public/small/Cloud';
import React, { Component } from 'react';
import styled from 'react-emotion';
import { breakpoints } from 'utils/media';

class Secure extends Component {
  render() {
    return (
      <SecureWrap
        id="secure"
        className="with-background with-gradient-background pt-7 pt-lg-11 d-none d-md-block"
      >
        <h2 className="env-head m-0 pb-8 text-center">
          Work in a secure and reliable <br />
          environment with no limits
        </h2>
        <div className="public-container background-wrapper text-center">
          <img src={app_image} className="img-responsive" />

          <SvgRender
            wrapperClassName="tornado-bg tornado-bg-1 d-none d-lg-block"
            path={air_tornado}
            style={{ height: 300, width: 417 }}
          />
          <SvgRender
            wrapperClassName="tornado-bg tornado-bg-2 d-none d-lg-block"
            path={air_tornado}
            style={{ height: 260, width: 283 }}
          />
          <Buildings />
        </div>

        <div
          id="secure-env-balloon"
          className="env-balloon d-none d-lg-block"
          style={{ backgroundImage: 'url("' + balloon + '")' }}
        />

        <Cloud wrapperClassName="first d-none d-lg-block" white />
        <Cloud wrapperClassName="second d-none d-lg-block" white />
        <Cloud wrapperClassName="third d-none d-lg-block" white />
        <Cloud wrapperClassName="last d-none d-lg-block" white />
      </SecureWrap>
    );
  }
}

export default Secure;

const SecureWrap = styled('div')`
  padding-bottom: 12rem;

  @media (max-width: ${breakpoints.lg - 1}px) {
    padding-bottom: 4rem;
  }

  .env-head {
    color: #fff;
    font-weight: 600;
  }

  .background-wrapper {
    position: relative;

    > img {
      max-width: 1060px;
      width: 100%;
      object-fit: contain;
    }

    .buildings-wrapper {
      position: absolute;
      bottom: 0;
      right: -0.5rem;

      > div:first-child {
        height: 5rem;
      }
    }

    > .tornado-bg {
      position: absolute;
      z-index: -1;

      &.tornado-bg-1 {
        bottom: -4rem;
        left: -7rem;
      }

      &.tornado-bg-2 {
        bottom: 5.5rem;
        right: -7rem;
      }
    }
  }

  .env-balloon {
    height: 233px;
    width: 181px;
    position: absolute;
    background-position: center;
    background-repeat: no-repeat;
    top: 20rem;
    left: 7.5rem;
    transition: all 0.5s;
  }

  > .cloud-wrapper {
    position: absolute;
    z-index: -1;

    &.first {
      top: 14rem;
      left: 14.5rem;
    }

    &.second {
      bottom: 15rem;
      left: 1.5rem;
    }

    &.third {
      right: 8rem;
      top: 14rem;
      transform: scaleX(-1);
    }

    &.last {
      right: 10rem;
      bottom: 40%;
    }
  }
`;
