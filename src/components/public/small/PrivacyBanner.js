import React, { Component } from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';

import variables from 'assets/sass/partials/_exports.scss';

class PrivacyBanner extends Component {
  render() {
    return (
      <PolicyMessage className="d-flex align-items-center justify-content-between pt-1 pb-1 pl-7 pr-7">
        <span>
          Welcome to yBit. This is a typical annoying box saying that we use cookies. You probably
          don't care, but in case you do, here's our{' '}
          <Link to="/legal/privacy-policy">privacy policy.</Link>
        </span>

        <button type="button" className="btn btn-black pl-6 pr-6">
          <strong>Whatever</strong>
        </button>
      </PolicyMessage>
    );
  }
}

export default PrivacyBanner;

const PolicyMessage = styled('div')`
  position: fixed;
  width: 100%;
  background: #fff;
  bottom: 0;
  left: 0;
  min-height: ${variables.size64};
  color: #000000;

  a:not(.btn) {
    color: #000000;
    text-decoration: underline !important;
  }
`;
