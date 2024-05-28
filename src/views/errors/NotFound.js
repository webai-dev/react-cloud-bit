import React, { Component } from 'react';
import styled from 'react-emotion';

import { Row, Col } from 'reactstrap';

import variables from 'assets/sass/partials/_exports.scss';

import SvgRender from 'components/general/SvgRender';
import { breakpoints } from 'utils/media';

import balloon from 'assets/svg/public/ballon_and_air.svg';
import cloud from 'assets/svg/public/cloud.svg';

class NotFound extends Component {
  handleRedirectBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <NotFoundWrapper className="public-inner-wrapper d-flex">
        <div className="with-background with-gradient-background-vertical">
          <Row className="justify-content-center mt-4 mt-md-0 mt-lg-6">
            <Col lg="12">
              <Row className="justify-content-center mr-1 mr-md-6 mr-lg-10 mb-7 mb-md-0">
                <SvgRender className="ballon" path={balloon} />
              </Row>
              <Row className="info-wrapper justify-content-center">
                <Col lg="12">
                  <Row className="justify-content-center">
                    <span className="header-404">404</span>
                  </Row>
                  <Row className="justify-content-center">
                    <span className="text-lost text-center">
                      Whooooooops! Looks like you were lost in your journey!
                    </span>
                  </Row>
                  <Row className="justify-content-center mt-4 mt-md-6">
                    <button
                      type="button"
                      className="btn text-white"
                      onClick={e => this.handleRedirectBack()}
                    >
                      Go Back
                    </button>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
          <SvgRender
            wrapperClassName="one d-block d-md-none d-lg-block cloud-wrapper white-cloud"
            className="dimensions-svg"
            path={cloud}
          />
          <SvgRender
            wrapperClassName="two d-none d-lg-block cloud-wrapper white-cloud"
            className="dimensions-svg"
            path={cloud}
          />
          <SvgRender
            wrapperClassName="three d-block cloud-wrapper white-cloud"
            className="dimensions-svg"
            path={cloud}
          />
          <SvgRender
            wrapperClassName="four d-block cloud-wrapper white-cloud"
            className="dimensions-svg"
            path={cloud}
          />
          <SvgRender
            wrapperClassName="five d-block cloud-wrapper white-cloud"
            className="dimensions-svg"
            path={cloud}
          />
        </div>
      </NotFoundWrapper>
    );
  }
}

export default NotFound;

const NotFoundWrapper = styled('div')`
  height: 100vh;

  > .with-background.with-gradient-background-vertical {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    > div:first-child {
      z-index: 1;

      .ballon {
        height: calc(100vh - 26rem);
      }

      .info-wrapper {
        .header-404 {
          font-size: ${variables.size128};
          line-height: ${variables.size136};
          font-weight: 600;
        }

        .text-lost {
          font-size: ${variables.size24};
          font-weight: 300;
        }

        .btn {
          height: 3.5rem;
          width: 14rem;
          font-size: ${variables.size16};
          background-color: #1bcedf;
        }
      }

      @media (max-width: ${breakpoints.lg - 1}px) {
        .ballon {
          height: calc(100vh - 22rem);
        }

        .info-wrapper {
          .header-404 {
            font-size: ${variables.size104};
            line-height: ${variables.size104};
          }

          .text-lost {
            font-size: ${variables.size16};
          }
        }
      }

      @media (max-width: ${breakpoints.md - 1}px) {
        .ballon {
          height: calc(100vh - 22rem);
        }

        .info-wrapper {
          .header-404 {
            font-size: ${variables.size56};
            line-height: ${variables.size72};
          }

          .text-lost {
            font-size: ${variables.size16};
            width: 12.9rem;
          }

          .btn {
            height: 2.5rem;
            width: 8rem;
          }
        }
      }
    }

    > .cloud-wrapper {
      position: absolute;
      z-index: 0;

      .cloud-fill {
        fill: #fff;
        opacity: 1;
      }

      &.one {
        top: 28.6%;
        left: 15.3%;
        transform: scaleX(-1);

        .dimensions-svg {
          height: 68px;
          width: 204px;
        }
      }

      &.two {
        top: 22.5%;
        left: 75.5%;

        .dimensions-svg {
          height: 134px;
          width: 400px;
        }
      }

      &.three {
        top: 46.8%;
        left: 30.2%;
        transform: scaleX(-1);

        .dimensions-svg {
          height: 68px;
          width: 204px;
        }
      }

      &.four {
        top: 67.5%;
        left: 74.1%;
        transform: scaleX(-1);

        svg {
          height: 119px;
          width: 353px;
        }
      }

      &.five {
        top: 88.6%;
        left: 3.75%;

        svg {
          height: 75px;
          width: 222px;
        }
      }

      @media (max-width: ${breakpoints.lg - 1}px) {
        &.three {
          top: 39.8%;
          left: 69.5%;
        }

        &.four {
          top: 61.6%;
          left: 58.7%;
        }

        &.five {
          top: 83.8%;
          left: 0.34%;
        }
      }

      @media (max-width: ${breakpoints.md - 1}px) {
        &.one {
          top: 0.15%;
          left: 11.2%;

          svg {
            height: 38px;
            width: 115px;
          }
        }

        &.three {
          top: 22.78%;
          left: 58.67%;

          svg {
            height: 38px;
            width: 115px;
          }
        }

        &.four {
          top: 52.47%;
          left: 0;

          svg {
            height: 42px;
            width: 126px;
          }
        }

        &.five {
          top: 42.12%;
          left: 75.47%;

          svg {
            height: 52px;
            width: 157px;
          }
        }
      }
    }
  }
`;
