import React from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

const BitCard = ({ label, icon }) => (
  <Container>
    <IconContainer>
      <Icon src={icon} />
    </IconContainer>
    <div>
      <Text>{label}</Text>
      <Secondary>Productivity</Secondary>
    </div>
    <Badge>Free</Badge>
  </Container>
);
export default BitCard;

const Container = styled('div')`
  background: white;
  border: 1px solid #e1e7ee;
  border-radius: 3px;

  width: 230px;
  height: 80px;

  padding: ${variables.size16} ${variables.size14};
  margin-right: ${variables.size32};
  margin-bottom: ${variables.size16};

  display: flex;

  position: relative;
`;

const Badge = styled('div')`
  position: absolute;
  top: ${variables.size16};
  right: 0;

  padding: 0px ${variables.size12};

  background-color: ${variables.main};
  color: white;
  font-size: ${variables.size12};
`;

const IconContainer = styled('div')`
  border: 1px solid #e0e6ed;
  border-radius: 3px;
  background: white;
  width: ${variables.size48};
  height: ${variables.size48};

  padding: ${variables.size8};
  margin-right: ${variables.size16};
`;
const Icon = styled('div')`
  width: 100%;
  height: 100%;
  background: url(${props => props.src}) center center / contain no-repeat;
`;

const Text = styled('div')`
  font-size: 14px;
  line-height: 14px;
`;

const Secondary = styled('div')`
  font-size: 12px;
  line-height: 12px;
  color: ${variables.secondary};
`;
