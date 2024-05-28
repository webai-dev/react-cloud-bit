import React, { Component } from 'react';
import styled from 'react-emotion';
import { Row, Col } from 'reactstrap';

import SvgRender from 'components/general/SvgRender';
import logo from 'assets/svg/public/logo.svg';
import variables from 'assets/sass/partials/_exports.scss';
class LoginMobile extends Component {
  render() {
    return (
      <LoginMobileWrapper className="home-wrapper d-flex align-items-center justify-content-center">
        <Row className="justify-content-center">
          <Col xs="9">
            <Row className="justify-content-center">
              <SvgRender path={logo} style={{ height: 48 }} />
            </Row>
            <Row className="justify-content-center mt-8">
              <h5 className="text-center">We are currently working on a mobile app</h5>
            </Row>
            <Row className="justify-content-center mt-2">
              <p className="text-center">Ybit is for now, only accessible by desktop and tablet</p>
            </Row>
            <Row className="justify-content-center mt-5">
              <a href="/">
                <button className="btn">Back to Home</button>
              </a>
            </Row>
          </Col>
        </Row>
      </LoginMobileWrapper>
    );
  }
}

export default LoginMobile;

const LoginMobileWrapper = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #fff;
  z-index: 102;

  > div {
    > div {
      > div {
        h5 {
          width: 21.75rem;
          font-weight: 400;
        }

        p {
          width: 12.5rem;
          font-size: ${variables.size14};
          font-weight: 100;
        }

        button {
          font-size: ${variables.size14};
          font-weight: 700;
          color: #fff;
          background-color: #1bcedf;
          height: 2.5rem;
          width: 10rem;
        }
      }
    }
  }
`;
