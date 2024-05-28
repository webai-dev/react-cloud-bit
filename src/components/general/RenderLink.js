import React, { Component } from 'react';
import { baseDomain, teamSubdomain } from 'utils/variables';
import { Link } from 'react-router-dom';

export class RenderLink extends Component {
  render() {
    const subdomain = teamSubdomain();
    const { className, link } = this.props;

    return subdomain === '' ? (
      <Link to={`${link}`} className={`${className}`}>
        {this.props.children}
      </Link>
    ) : (
      <a className={`${className}`} href={`${window.location.protocol}//${baseDomain()}${link}`}>
        {this.props.children}
      </a>
    );
  }
}

export default RenderLink;
