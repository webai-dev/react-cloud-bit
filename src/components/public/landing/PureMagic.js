import variables from 'assets/sass/partials/_exports.scss';
import bits from 'assets/svg/public/bits.svg';
import files from 'assets/svg/public/files.svg';
import teams from 'assets/svg/public/teams.svg';
import wand from 'assets/svg/public/wand.svg';
import SvgRender from 'components/general/SvgRender';
import Buildings from 'components/public/small/Buildings';
import Cloud from 'components/public/small/Cloud';
import React, { Component } from 'react';
import styled from 'react-emotion';
import { Col, Row } from 'reactstrap';
import { breakpoints } from 'utils/media';

class PureMagic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flows: [
        {
          image: teams,
          head: 'Teams',
          text:
            'Work together and lift your team to the sky. Create your teams and have your data and applications in the right place. Organize them in folders, share with your teammates, and have them everywhere you are.'
        },
        {
          image: files,
          head: 'Files & Folders',
          text:
            'Everything on the right spot. You can access them anytime, anywhere. You have one central space to manage everything. Effortlessly, upload, download, share and keep versions of your files. '
        },
        {
          image: bits,
          head: 'Bits',
          text:
            'Bits are what make ybit work its magic. Imagine taking an application with its data, putting it in a box, and using it like a file and organizing it in folders. Now imagine doing that with all your workflow tools!'
        }
      ]
    };
  }

  render() {
    return (
      <Flow id="pure-magic" className="with-background with-gradient-background pb-3">
        <div className="flow-box-wrapper public-container pt-6 pr-5 pb-6 pl-5 pr-md-10 pl-md-10 p-md-6 pl-lg-6 pb-lg-11 pr-lg-6">
          <div className="flow-box-head d-flex align-items-center justify-content-center mt-0 mt-lg-8">
            <h4 id="pure-magic-header" className="mb-0 text-center">
              Pure magic collaboration flow
            </h4>
          </div>
          <div className="flow-box-head d-flex align-items-center justify-content-center mt-1 mt-lg-2 mb-7 mb-lg-12">
            <h6 className="mb-0 text-center">
              With powerful tools and Bits you can simplify your everyday routine.
            </h6>
          </div>

          <Row className="flow-boxes-wrap">
            {this.state.flows.map((f, i) => (
              <Col xs="12" md="9" lg="4" key={i} className="mb-6 mb-lg-0">
                <div className="flow-box-inner d-flex align-items-center justify-content-center flex-column">
                  <div className="flow-box-inner-bg">
                    <SvgRender style={{ height: 48 }} path={f.image} />
                  </div>
                  <h5 className="flow-box-inner-head mt-4">{f.head}</h5>
                  <div className="flow-box-inner-sec text-center">{f.text}</div>
                </div>
              </Col>
            ))}
          </Row>

          <Cloud wrapperClassName="last d-none d-lg-block" />
          <Buildings />
        </div>

        <Cloud wrapperClassName="first d-none d-lg-block" white />
        <Cloud wrapperClassName="second d-none d-lg-block" white />
        <Cloud wrapperClassName="third d-none d-lg-block" white />
      </Flow>
    );
  }
}

export default PureMagic;

const Flow = styled('div')`
  .flow-box-wrapper {
    background: #fff;
    box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: ${variables.borderRadiusBase};
    position: relative;
    top: -${variables.size56};

    .flow-box-head {
      h4 {
        position: relative;
        
        @media (max-width: ${breakpoints.lg - 1}px) {
          font-size: ${variables.size24};
        }
        
        @media (max-width: ${breakpoints.md - 1}px) {
          font-size: ${variables.size24};
        }
        
        &.show {
          &:before {
            content: '';
            position: absolute;
            height: 54px;
            width: 85px;
            top: -24px;
            left: -60px;
            background: url("${wand}") no-repeat center;
            background-size: contain;
            
            @media (max-width: ${breakpoints.lg - 1}px) {
              height: 44px;
              width: 56px;
              top: -18px;
              left: -46px;
            }
            
            @media (max-width: ${breakpoints.md - 1}px) {
              top: -18px;
              left: 16px;
            }
          }
        }
      }
      
      h6 {
        color: ${variables.publicSec};
        font-weight: 400;
        
        @media (max-width: ${breakpoints.lg - 1}px) {
          font-size: ${variables.size16};
        }
        
        @media (max-width: ${breakpoints.md - 1}px) {
          font-size: ${variables.size14};
        }
      }
    }
    
    h5 {
      font-size: ${variables.size20};
    }
    
    .flow-boxes-wrap {
      margin-left: -${variables.size24};
      margin-right: -${variables.size24};
      
      > div {
        padding: 0 ${variables.size24};
        
        @media (max-width: ${breakpoints.lg - 1}px) {
          margin: auto;
        }
        
        .flow-box-inner {
          h5 {
            @media (max-width: ${breakpoints.lg - 1}px) {
              font-size: ${variables.size16};
            }
          }
          
          .flow-box-inner-sec {
            color: ${variables.publicLightGray};
        
            @media (max-width: ${breakpoints.lg - 1}px) {
              font-size: ${variables.size12};
            }
          }
        }
        
        &:last-child {
          margin-bottom: 0 !important;
        }
      }
    }
    
    .cloud-wrapper.last {
      position: absolute;
      bottom: 0;
      left: -4rem;
      height: 62px
    }
    
    .buildings-wrapper {
      position: absolute;
      bottom: -1px;
      right: -1rem;
      
      > div:first-child {
        height: 5rem;
      }
    }
  }
  
  > .cloud-wrapper {
    position: absolute;
    
    &.first {
      top: 6.5rem;
      left: 10.5rem;
    }
    
    &.second {
      top: 17.5rem;
      left: 15.5rem;
    }
    
    &.third {
      right: 8rem;
      top: 15.5rem;
      transform: scaleX(-1);
    }
  }
`;
