import React, { Fragment } from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import { Title, SecondaryText } from '../common';

const StepDisplay = ({ step, of }) => (
  <Fragment>
    <Title>Specify your needs for Ybit Custom</Title>
    <SecondaryText className="mb-3">
      No credit card required. No setup fees. No obligation.
    </SecondaryText>
    <Text>
      Step {step} of {of}
    </Text>
  </Fragment>
);
export default StepDisplay;

const Text = styled('div')`
  font-size: ${variables.size14};
  margin-bottom: ${variables.size32};
`;
