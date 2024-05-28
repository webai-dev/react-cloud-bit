import step1 from 'assets/img/public/step1.png';
import step2 from 'assets/img/public/step2.png';
import step3 from 'assets/img/public/step3.png';
import variables from 'assets/sass/partials/_exports.scss';
import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import { Col, Row } from 'reactstrap';
import { breakpoints } from 'utils/media';

class Steps extends Component {
  constructor(props) {
    super(props);

    this.state = {
      steps: [
        {
          image: {
            src: step1,
            height: 435,
            className: stepImage1,
            wrapperClassName: 'col-12 col-lg-6 mb-9 mb-md-10 mb-lg-0'
          },
          head: 'Manage files & folders',
          text: {
            content:
              'No more email attachment needed. No more transfer files with external unsafe applications. With just a few drags and drops, have all your files and foders on ybit and make the life of your team easier. You can store any kind of file and they’ll follow you everywhere. That easy!',
            wrapperClassName: 'col-12 col-lg-4'
          }
        },
        {
          image: {
            src: step2,
            height: 368,
            className: stepImage2,
            wrapperClassName: 'col-12 col-lg-8 mb-9 mb-md-10 mb-lg-0'
          },
          head: 'Create a Bit',
          text: {
            content:
              'Create magic Bits and make your routine happen in just a tab of your browser. We’ve created some Bits just to start with. But imagine… All your applications can be stored in your convenient folder and you can share them with your fellows! It’s hard to believe, but it happens :)',
            wrapperClassName: 'col-12 col-lg-4 offset-lg-1'
          }
        },
        {
          image: {
            src: step3,
            height: 430,
            className: stepImage3,
            wrapperClassName: 'col-12 col-lg-auto offset-lg-1 mb-9 mb-md-10 mb-lg-0'
          },
          head: 'Share what’s necessary',
          text: {
            content:
              'All your work, safe, and easy to share. With just a click of a button, choose with whom you want to share, edit or just view a folder, file, or an application.',
            wrapperClassName: 'col-12 col-lg-4'
          }
        }
      ]
    };
  }

  render() {
    return (
      <StepsWrap id="features">
        {this.state.steps.map((step, i) => (
          <div
            className={`step-inner pt-8 pb-8 with-background ${
              (i + 1) % 2 !== 0 ? 'with-light-bg' : ''
            }`}
            key={i}
          >
            <div className="public-container">
              <Row className="align-items-center row-wrapper">
                <Col className={'order-2 order-lg-1 ' + step.text.wrapperClassName}>
                  <h4 className="step-head mb-1">
                    <div className="step-number">0{i + 1}</div>
                    <span className="position-relative">{step.head}</span>
                  </h4>
                  <div className="step-text">{step.text.content}</div>
                </Col>
                <Col className={'order-1 order-lg-2 ' + step.image.wrapperClassName}>
                  <div className="image-wrapper" align="center">
                    <img
                      src={step.image.src}
                      className={'img-responsive ' + step.image.className}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        ))}
      </StepsWrap>
    );
  }
}

export default Steps;

const StepsWrap = styled('div')`
  > .step-inner {
    &:nth-child(even) {
      .row-wrapper {
        > .col {
          &:first-child {
            order: 2;
          }

          &:last-child {
            order: 1;
          }
        }
      }
    }

    &:nth-child(2) {
      .row-wrapper {
        > .col {
          &:last-child {
            margin-left: -10rem;
          }

          @media (max-width: ${breakpoints.lg - 1}px) {
            margin-left: 0;

            &:last-child {
              margin-left: 0;
            }
          }
        }
      }
    }

    .image-wrapper {
      img {
        object-fit: contain;
        width: 100%;
      }
    }

    .step-head {
      position: relative;
      font-weight: 600;

      @media (max-width: ${breakpoints.md - 1}px) {
        span {
          font-size: ${variables.size24};
        }
      }

      .step-number {
        font-size: ${variables.size128};
        color: ${variables.publicLightGrayColor};
        font-weight: 400;
        position: absolute;
        top: -5.5rem;
        left: -2rem;

        @media (max-width: ${breakpoints.lg - 1}px) {
          font-size: ${variables.size72};
          top: -1.7rem;
          left: -0.7rem;
        }

        @media (max-width: ${breakpoints.md - 1}px) {
          font-size: 3.5rem;
          top: -1.3rem;
          left: -0.7rem;
        }

        &:before {
          content: '';
          position: absolute;
          height: 3px;
          width: 56px;
          background: linear-gradient(270deg, #e2f2f2 0%, #61c0da 100%);
          bottom: 2.15rem;
          left: 1.15rem;

          @media (max-width: ${breakpoints.lg - 1}px) {
            bottom: 1.8rem;
            left: 0.15rem;
          }

          @media (max-width: ${breakpoints.md - 1}px) {
            bottom: 1.05rem;
          }
        }
      }
    }

    .step-text {
      color: ${variables.publicLightGray};
    }
  }
`;

const stepImage1 = css`
  max-width: 640px;
`;

const stepImage2 = css`
  max-width: 872px;
`;

const stepImage3 = css`
  max-width: 482px;
`;
