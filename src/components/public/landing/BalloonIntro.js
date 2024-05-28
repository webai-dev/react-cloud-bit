import variables from 'assets/sass/partials/_exports.scss';
import artwork from 'assets/svg/public/artwork.svg';
import balloon from 'assets/svg/public/balloon.svg';
import car from 'assets/svg/public/car.svg';
import React, { Component } from 'react';
import styled from 'react-emotion';
import { Col, Row } from 'reactstrap';
import { breakpoints } from 'utils/media';

class BalloonIntro extends Component {
  render() {
    return (
      <Balloon className="ballon-intro mt-6 mt-md-9 mt-lg-12 pb-12 pb-md-14 pb-lg-20">
        <Row className="align-items-center">
          <Col xs="12" xl="auto">
            <div className="artwork-wrapper mb-4 mb-md-6 mb-lg-0">
              <h1 className="artwork-head mb-1 mb-md-2 mb-lg-3">
                <span className="artwork-head-top">Workflow</span>
                <span id="ballon-intro-artwork-head-bottom" className="artwork-head-bottom">
                  simplified
                </span>
              </h1>
              <h4 className="artwork-line mb-0 mt-0">
                Manage team folders, files, & <strong>applications</strong> <br /> in a
                <strong> single</strong> browser tab
              </h4>
            </div>
          </Col>
          <Col>
            <div
              className="artwork-background"
              style={{ backgroundImage: 'url("' + artwork + '")' }}
            >
              <div
                className="artwork-balloon"
                style={{ backgroundImage: 'url("' + balloon + '")' }}
              />
              <div
                id="ballon-intro-artwork-car"
                className="artwork-car"
                style={{ backgroundImage: 'url("' + car + '")' }}
              />
              {/*<SvgRender path={artwork} style={{ height: 734 }} />*/}
            </div>
          </Col>
        </Row>
      </Balloon>
    );
  }
}

export default BalloonIntro;

const Balloon = styled('div')`
  .artwork-wrapper {
    @media (min-width: ${breakpoints.hd}px) {
      padding-left: 8rem;
    }

    .artwork-head {
      font-size: ${variables.size128};
      line-height: 159px;

      @media (max-width: ${breakpoints.lap - 1}px) {
        font-size: ${variables.size104};
        line-height: ${variables.size128};
      }

      @media (max-width: ${breakpoints.md - 1}px) {
        font-size: ${variables.size56};
        line-height: 69px;
      }

      > span {
        display: block;
        font-weight: 800;

        &.artwork-head-bottom {
          position: relative;
          z-index: 1;

          &:before {
            content: '';
            position: absolute;
            background: linear-gradient(270deg, #e2f2f2 0%, #61c0da 100%);
            display: block;
            height: 100%;
            width: 0;
            z-index: -1;
            left: -1rem;
            top: 0;
            transition: width 1s ease-out;
          }

          &.show {
            &:before {
              width: 386px;

              @media (max-width: ${breakpoints.lap - 1}px) {
                width: 295px;
              }

              @media (max-width: ${breakpoints.md - 1}px) {
                width: 127px;
              }
            }
          }
        }
      }
    }

    .artwork-line {
      font-weight: 300;
      line-height: 45px;

      @media (max-width: ${breakpoints.lg - 1}px) {
        font-size: ${variables.size32};
        line-height: ${variables.size48};
      }

      @media (max-width: ${breakpoints.md - 1}px) {
        font-size: ${variables.size16};
        line-height: ${variables.size24};
      }
    }
  }

  .artwork-background {
    position: relative;
    height: 734px;
    max-width: 912px;
    width: 100%;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: bottom;
    margin: 0 auto;

    @media (max-width: ${breakpoints.lap - 1}px) {
      background-position-y: calc(100% - 4rem);
    }

    @media (max-width: ${breakpoints.xl - 1}px) {
      height: 427px;
      max-width: 528px;
      background-position-y: bottom;
    }

    @media (max-width: ${breakpoints.md - 1}px) {
      height: 251px;
      max-width: 312px;
    }

    .artwork-balloon {
      position: absolute;
      background-position: center;
      background-repeat: no-repeat;
      height: 267px;
      width: 168px;
      top: 15rem;
      left: 6rem;

      @media (max-width: ${breakpoints.xl - 1}px) {
        height: 272px;
        width: 216px;
        top: 5rem;
        left: 4rem;
      }

      @media (max-width: ${breakpoints.md - 1}px) {
        height: 161px;
        max-width: 128px;
        top: 50px;
        left: 2.5rem;
      }

      @media (min-width: ${breakpoints.hd}px) {
        height: 467px;
        width: 368px;
        top: 9rem;
        left: 6rem;
      }
    }

    .artwork-car {
      position: absolute;
      background-position: center;
      background-repeat: no-repeat;
      height: 20px;
      width: 33px;
      bottom: 0;
      left: 36.3rem;
      transition: all 1s;

      @media (max-width: ${breakpoints.lap - 1}px) {
        bottom: 4rem;
      }

      @media (max-width: ${breakpoints.xl - 1}px) {
        bottom: 0;
      }

      @media (max-width: ${breakpoints.lg - 1}px) {
        height: 14px;
        width: 24px;
        left: 20rem;
      }

      @media (max-width: ${breakpoints.md - 1}px) {
        height: 10px;
        width: 17px;
        left: 12rem;
      }
    }
  }
`;
