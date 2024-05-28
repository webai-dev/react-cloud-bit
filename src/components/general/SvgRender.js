import React from 'react';
import { css } from 'react-emotion';

import ReactSVG from 'react-svg';

class SvgRender extends React.Component {
  render() {
    const { path, wrapperClassName, className, style, ...rest } = this.props;

    return (
      <ReactSVG
        path={path}
        svgClassName={className}
        className={`svg-wrap d-flex align-items-center ${
          wrapperClassName ? wrapperClassName : ''
        } ${wrapStyle}`}
        svgStyle={style}
        {...rest}
      />
    );
  }
}

export default SvgRender;

const wrapStyle = css`
  > div {
    display: inherit;
    height: auto;
  }

  svg {
    height: inherit;

    * {
      transition: all 0.15s ease;
    }
  }
`;
