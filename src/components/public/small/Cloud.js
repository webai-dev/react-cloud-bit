import React, { Component } from 'react';
import { css } from 'react-emotion';

import SvgRender from 'components/general/SvgRender';

import cloud from 'assets/svg/public/cloud.svg';

class Cloud extends Component {
  render() {
    return (
      <SvgRender
        wrapperClassName={`cloud-wrapper ${cloudStyle} ${this.props.white ? 'white-cloud' : ''} ${
          this.props.wrapperClassName ? this.props.wrapperClassName : ''
        }`}
        path={cloud}
        style={{ height: 62, ...this.props.style }}
      />
    );
  }
}

export default Cloud;

const cloudStyle = css`
  &.white-cloud {
    .cloud-fill {
      fill: #fff;
      opacity: 0.1;
    }
  }
`;
