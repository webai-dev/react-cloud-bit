import React, { Component } from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import { Row, Col } from 'reactstrap';
import variables from 'assets/sass/partials/_exports.scss';

import park from 'assets/img/public/park.png';
import parkMobile from 'assets/img/public/park-mobile.png';

import { breakpoints } from 'utils/media';

class Usage extends Component {
  render() {
    return (
      <UsageWrap className="with-background">
        <div className="public-container h-100 d-flex align-items-center justify-content-end">
          <Row className="justify-content-center justify-content-md-end">
            <Col xs="12" md="7" className="text-center text-md-left">
              <h2 className="usage-head mb-4">
                Used by hundreds of businesses already. More than 10,000 people simplified their
                everyday flow.
              </h2>
              <Link
                to={this.props.authenticated ? '/intro' : '/login'}
                className="btn btn-orange d-inline-flex align-items-center justify-content-center pl-5 pr-5"
              >
                <strong>Log In</strong>
              </Link>
            </Col>
          </Row>
        </div>
      </UsageWrap>
    );
  }
}

export default Usage;

const UsageWrap = styled('div')`
  height: 37.5rem;
  
  @media (max-width: ${breakpoints.lg - 1}px) {
    height: 31.5rem;
  }
  
  .usage-head {
    color: #fff;
    
    @media (max-width: ${breakpoints.lg - 1}px) {
      font-size: ${variables.size24};
    }
  }
  
  .btn.btn-orange {
    color: #e02111;
  }
  
  &:before {
    background: url("${park}");
    
    @media (max-width: ${breakpoints.hd - 1}px) {
      background-position: -95px 0;
    }
    
    @media (max-width: ${breakpoints.lap - 1}px) {
      background-position: -326px 0;
    }
    
    @media (max-width: ${breakpoints.lg - 1}px) {
      background-position: -371px -23px;
      background-size: 220%;
    }
    
    @media (max-width: ${breakpoints.md - 1}px) {
      background: url("${parkMobile}");
      background-position: left bottom;
    }
  }
`;
