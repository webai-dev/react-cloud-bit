import variables from 'assets/sass/partials/_exports.scss';
import plan_custom from 'assets/svg/public/plan_custom.svg';
import plan_free from 'assets/svg/public/plan_free.svg';
import plan_grow from 'assets/svg/public/plan_grow.svg';
import small_ballon from 'assets/svg/public/small_ballon.svg';
import React, { Component } from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { breakpoints } from 'utils/media';

class Plans extends Component {
  constructor(props) {
    super(props);

    this.state = {
      plans: [
        {
          name: 'FREE FOREVER',
          image: plan_free,
          width: 168,
          small: 'It is free, and it will always be',
          desc_first: '50 GB of Team Storage',
          desc_sec: 'Unlimited Users'
        },
        {
          name: 'GROW',
          image: plan_grow,
          width: 168,
          small: '$40.00 per month',
          desc_first: '1 TB of Team Storage',
          desc_sec: 'You can buy more storage any time'
        },
        {
          name: 'CUSTOM',
          image: plan_custom,
          extra_image: small_ballon,
          width: 247,
          extra_width: 26,
          small: 'Starting at $450.00 per month',
          desc_first: 'Integrate with your AWS S3 Storage',
          desc_sec: 'Custom Bits specially designed for you'
        }
      ]
    };
  }

  render() {
    return (
      <PlansWrap id="pricing">
        <div className="public-container">
          <div className="text-center">
            <h4 className="plans-head mb-0">Plans & Pricing</h4>
            <div className="plans-sec">
              Find the perfect plan for you — 100% satisfaction guaranteed.
            </div>
          </div>

          <Row className="mt-0 mt-lg-11">
            {this.state.plans.map((p, i) => (
              <Col xs="12" md="8" lg="4" className="m-auto" key={i}>
                <div
                  className={`plan-inner-wrapper d-flex flex-column justify-content-center align-items-center pt-8 pb-8 pt-lg-1 pb-lg-5 ${
                    (i + 1) % 2 === 0 ? 'bordered' : ''
                  }`}
                >
                  <div className="plan-image-wrapper">
                    {i == 2 && (
                      <img src={p.extra_image} width={p.extra_width} className="plan-image-extra" />
                    )}
                    <img src={p.image} width={p.width} className="plan-image" />
                  </div>
                  <div className="plan-name pt-3 pb-1">
                    <strong>{p.name}</strong>
                  </div>
                  <div className="plan-desc mb-4">
                    <small>{p.small}</small>
                  </div>
                  <div className="plan-desc mb-2">{p.desc_first}</div>
                  <div className="plan-desc">{p.desc_sec}</div>
                </div>
              </Col>
            ))}
          </Row>

          <h6 className="text-center mt-4 d-none d-lg-block">
            Plans are applied to each team.{' '}
            {<Link to={this.props.authenticated ? '/intro' : '/login'}>Access your team</Link>} &
            choose one.
          </h6>
        </div>
      </PlansWrap>
    );
  }
}

export default Plans;

const PlansWrap = styled('div')`
  padding-top: 10rem;
  padding-bottom: 12rem;

  @media (max-width: ${breakpoints.lg - 1}px) {
    padding-top: 4rem;
    padding-bottom: 0;
  }

  .plans-head {
    font-weight: 600;

    @media (max-width: ${breakpoints.md - 1}px) {
      font-size: ${variables.size24};
    }
  }

  .plans-sec {
    color: ${variables.publicLightGray};
    font-size: ${variables.size20};

    @media (max-width: ${breakpoints.lg - 1}px) {
      font-size: ${variables.size16};
    }
  }

  .plan-inner-wrapper {
    > .plan-image-wrapper {
      position: relative;
      display: flex;
      height: 176px;
      width: 100%;

      @media (max-width: ${breakpoints.lg - 1}px) {
        height: auto;
      }

      > .plan-image {
        margin: auto auto 0 auto;
      }

      > .plan-image-extra {
        position: absolute;
        top: 2px;
        left: 178px;
      }
    }

    > .plan-desc {
      line-height: ${variables.size20};
      color: ${variables.publicLightGray};

      > small {
        font-size: ${variables.size14};
      }
    }

    &.bordered {
      border-left: 1px solid ${variables.publicBorder};
      border-right: 1px solid ${variables.publicBorder};

      @media (max-width: ${breakpoints.lg - 1}px) {
        border-top: 1px solid ${variables.publicBorder};
        border-bottom: 1px solid ${variables.publicBorder};
        border-left: none;
        border-right: none;
      }
    }
  }
`;
