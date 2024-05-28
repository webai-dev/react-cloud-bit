import React from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import { Title, ButtonRow, Button } from '../common';

const Step3 = ({ goBack }) => (
  <div>
    <Title className="mb-3">Thank you!</Title>
    <div className="mb-3">
      <Text>
        Thank you for contacting us! We have received your request and we are working on your needs.
      </Text>
      <Text>We will contact you withing 2-4 business days.</Text>
    </div>
    <ButtonRow>
      <Button type="button" className="btn btn-success" onClick={goBack}>
        Back to Plans
      </Button>
    </ButtonRow>
  </div>
);
export default Step3;

const Text = styled('div')`
  font-size: ${variables.size14};
`;
