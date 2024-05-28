import variables from 'assets/sass/partials/_exports.scss';
import facebook from 'assets/svg/public/facebook.svg';
import linkedIn from 'assets/svg/public/linkedIn.svg';
import logo from 'assets/svg/public/logo.svg';
import twitter from 'assets/svg/public/twitter.svg';
import SvgRender from 'components/general/SvgRender';
import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Collapse, Nav, Navbar, NavbarToggler, NavItem } from 'reactstrap';
import Dropdown from './Dropdown';

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    if (!this.state.isOpen) {
      document.querySelector('html').classList.add('prevent-scroll');
    } else {
      document.querySelector('html').classList.remove('prevent-scroll');
    }

    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  scrollToSection(section) {
    const el = document.getElementById(section);

    if (el) {
      window.scroll({
        top: el.getBoundingClientRect().top,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      this.props.history.push('/');
      setTimeout(() => {
        window.scroll({
          top: document.getElementById(section).getBoundingClientRect().top,
          left: 0,
          behavior: 'smooth'
        });
      }, 500);
    }
  }

  componentWillUnmount() {
    document.querySelector('html').classList.remove('prevent-scroll');
  }

  render() {
    const { loginHide, authenticated } = this.props;
    return (
      <Navbar expand="lg" className={LandingNav + ' p-0'}>
        <Link to={`/`} className="navbar-brand p-0">
          <SvgRender className="d-none d-md-flex" style={{ height: 40 }} path={logo} />
          <SvgRender className="d-flex d-md-none" style={{ height: 32 }} path={logo} />
        </Link>

        <NavbarToggler
          id="menu-toggle"
          className={'hamburger hamburger--squeeze btn' + (this.state.isOpen ? ' open' : '')}
          onClick={e => this.toggle()}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </NavbarToggler>
        <Collapse
          id="navbarMenu"
          isOpen={this.state.isOpen}
          className="justify-content-between navbar-collapse"
          navbar
        >
          <Nav className="ml-lg-6 align-items-center" navbar>
            <NavItem className="d-none d-lg-block mr-lg-6">
              <button
                type="button"
                className="btn btn-empty p-0"
                onClick={e => this.scrollToSection('features')}
              >
                Features
              </button>
            </NavItem>
            <NavItem className="d-none d-lg-block mr-lg-6">
              <button
                type="button"
                className="btn btn-empty p-0"
                onClick={e => this.scrollToSection('pricing')}
              >
                Pricing
              </button>
            </NavItem>
            <NavItem className="d-block d-lg-none mr-lg-6">
              <NavLink to={`/`} exact={true}>
                Home
              </NavLink>
            </NavItem>
            <NavItem className="mr-lg-6">
              <a href="https://docs.ybit.io/">Developers</a>
            </NavItem>
            <NavItem className="d-none d-md-block d-lg-none mr-lg-6">
              <NavLink to={`/legal/privacy-policy`} exact={true}>
                Legal
              </NavLink>
            </NavItem>
            {!loginHide && (
              <Link
                to={authenticated ? '/intro' : '/login'}
                className="btn btn-public d-flex d-lg-none align-items-center justify-content-center pl-5 pr-5"
              >
                Log In
              </Link>
            )}
          </Nav>
          <div className="menu-footer d-flex d-lg-none align-items-center justify-content-between">
            <a className="copyright d-block d-md-none mb-0" href="privacy-policy">
              Legal Documents
            </a>
            <p className="copyright d-none d-md-block mb-0 d-none d-md-block">
              Apparatus App © 2018 All Rights Reserved
            </p>
            <div className="social-wrap d-flex d-lg-none align-items-center">
              <a href="#">
                <SvgRender style={{ height: 16 }} path={facebook} wrapperClassName="white-svg" />
              </a>
              <a href="#" className="ml-2 mr-2">
                <SvgRender style={{ height: 16 }} path={twitter} wrapperClassName="white-svg" />
              </a>
              <a href="#">
                <SvgRender style={{ height: 16 }} path={linkedIn} wrapperClassName="white-svg" />
              </a>
            </div>
          </div>
          {!loginHide &&
            (authenticated ? (
              <Dropdown />
            ) : (
              <Link
                to="/login"
                className="btn btn-public d-none d-lg-flex align-items-center justify-content-center pl-5 pr-5"
              >
                <strong>Log In</strong>
              </Link>
            ))}
        </Collapse>
      </Navbar>
    );
  }
}

export default withRouter(Header);

const LandingNav = css`
  .navbar-nav {
    .nav-item {
      > .btn {
        height: auto;
        font-size: inherit;
        display: inherit;

        color: ${variables.publicText};

        &:hover {
          color: ${variables.publicLink};
        }
      }

      > a,
      > .btn {
        line-height: ${variables.size20};
        font-weight: 300;
      }
    }
  }
`;
