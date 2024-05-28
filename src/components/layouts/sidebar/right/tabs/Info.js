import React from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import SvgRender from 'components/general/SvgRender';
import close from 'assets/svg/actions/close.svg';

const Info = props => (
  <div className="d-flex flex-column p-4">
    <div className="d-flex justify-content-between">
      <Title>Info</Title>
      <IconButton onClick={props.hideSidebar}>
        <SvgRender style={{ height: 16 }} path={close} />
      </IconButton>
    </div>
  </div>
);

export default Info;

const Title = styled('div')`
  font-size: ${variables.size16};
  font-weight: 600;
`;

const IconButton = styled('div')`
  cursor: pointer;
`;
