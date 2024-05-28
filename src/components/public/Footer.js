import variables from 'assets/sass/partials/_exports.scss';
import facebook from 'assets/svg/public/facebook.svg';
import linkedIn from 'assets/svg/public/linkedIn.svg';
import logo_black from 'assets/svg/public/logo_black.svg';
import twitter from 'assets/svg/public/twitter.svg';
import SvgRender from 'components/general/SvgRender';
import React, { Component } from 'react';
import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import { breakpoints } from 'utils/media';

class Footer extends Component {
  render() {
    return (
      <FooterWrap id="footer">
        <div className="footer-main d-none d-md-flex align-items-center justify-content-center">
          <Link to={`/`} className="navbar-brand p-0 mr-auto">
            <SvgRender style={{ height: 24 }} path={logo_black} />
          </Link>

          <div className="copyright-text d-none d-lg-block mx-auto">
            Web That Matters LLC © 2018 All Rights Reserved
          </div>

          <div className="footer-more d-flex align-items-center">
            <Link to={`/legal/privacy-policy`} className="d-none d-lg-block">
              Legal documents
            </Link>
            <div className="social-wrap d-flex align-items-center pl-2 ml-2">
              <span className="pr-3 d-none d-lg-block">Follow us:</span>
              <a href="#">
                <SvgRender style={{ height: 16 }} path={facebook} />
              </a>
              <a href="#" className="ml-2 mr-2">
                <SvgRender style={{ height: 16 }} path={twitter} />
              </a>
              <a href="#">
                <SvgRender style={{ height: 16 }} path={linkedIn} />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-aux d-flex d-lg-none align-items-center justify-content-center with-background with-light-bg">
          <div className="copyright-text">Web That Matters LLC © 2018 All Rights Reserved</div>
        </div>
      </FooterWrap>
    );
  }
}

export default Footer;

const FooterWrap = styled('div')`
  height: ${variables.size80};

  @media (max-width: ${breakpoints.lg - 1}px) {
    height: ${variables.size128};
    font-size: 12px;
  }

  @media (max-width: ${breakpoints.md - 1}px) {
    height: ${variables.size48};
  }

  .footer-main {
    height: ${variables.size80};

    .copyright-text {
      color: #000;
    }

    .social-wrap {
      border-left: 1px solid ${variables.publicBorder};

      @media (max-width: ${breakpoints.lg - 1}px) {
        border-left: none;
      }
    }

    .hide-logo-text {
      display: none;
    }
  }

  .footer-aux {
    height: ${variables.size48};
  }
`;
