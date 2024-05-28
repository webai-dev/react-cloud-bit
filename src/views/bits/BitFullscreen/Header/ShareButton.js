import React from 'react';

import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import SvgRender from 'components/general/SvgRender';
import share from 'assets/svg/actions/share.svg';
import pp from 'assets/svg/general/shared-pp-simple.svg';

const ShareButton = ({ shares, onClick }) => (
  <Button className="btn btn-main" onClick={onClick}>
    {shares > 0 && (
      <SharesWrapper>
        <SvgRender path={pp} style={{ height: 16 }} />
        <Bigger>{shares + 1}</Bigger>
      </SharesWrapper>
    )}
    <SvgRender path={share} style={{ height: 16 }} wrapperClassName={whiteIcon} />
    <b>Share</b>
  </Button>
);
export default ShareButton;

const Button = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bigger = styled('span')`
  font-size: ${variables.size16};
  margin-left: ${variables.size4};
`;

const SharesWrapper = styled('div')`
  margin-right: ${variables.size14};
  padding-right: ${variables.size14};
  display: flex;
  align-items: center;
  svg {
    margin-right: ${variables.size4};
  }
  path {
    fill: currentColor !important;
  }

  border-right: 1px solid white;
`;

const whiteIcon = css`
  margin-right: ${variables.size8};
  svg {
    margin-top: -${variables.size4};
    path {
      fill: currentColor !important;
    }
  }
`;
