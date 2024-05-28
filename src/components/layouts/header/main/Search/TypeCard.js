import React from 'react';

import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import SvgRender from 'components/general/SvgRender';

const TypeCard = ({ id, label, icon, iconWrapper, onClick, horizontal, selected }) => {
  let wrapperClassNames = '';
  if (iconWrapper) wrapperClassNames += iconContainer;
  else wrapperClassNames += cursorPointer;
  if (selected) wrapperClassNames += ' ' + highlightSelected;
  return (
    <TypeContainer key={id} horizontal={horizontal}>
      <SvgRender
        className="icon"
        path={icon}
        style={{ height: iconWrapper ? 16 : 32 }}
        wrapperClassName={wrapperClassNames}
        onClick={() => onClick && onClick(id)}
      />
      <Label horizontal={horizontal}>{label}</Label>
    </TypeContainer>
  );
};
export default TypeCard;

const TypeContainer = styled('div')`
  display: flex;
  flex-direction: ${({ horizontal }) => (horizontal ? 'row' : 'column')};
  align-items: center;
  width: ${({ horizontal }) => (horizontal ? 'inherit' : variables.size32)};
`;

const Label = styled('div')`
  margin-top: ${({ horizontal }) => (horizontal ? 0 : variables.size12)};
  margin-left: ${({ horizontal }) => (horizontal ? variables.size12 : 0)};
  font-size: ${variables.size12};
  white-space: nowrap;
`;

const iconContainer = css`
  width: ${variables.size32};
  height: ${variables.size32};
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #eaecef;
  border-radius: 6px;
  background-color: #f8f8f8;
  cursor: pointer;
`;
const cursorPointer = css`
  cursor: pointer;
`;

const highlightSelected = css`
  border: 1px solid ${variables.primary};
  border-radius: 6px;
`;

const Seperator = styled('div')`
  border-right: 1px solid #e6f0f7;
`;
