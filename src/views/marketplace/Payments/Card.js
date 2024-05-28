import React from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import SvgRender from 'components/general/SvgRender';

import { Container, Button } from './common';
import { Checkout } from '../common';

const getCardIcon = brand => {
  switch (brand) {
    case 'MasterCard':
      return require('assets/svg/cards/mastercard.svg');
    case 'Visa':
      return require('assets/svg/cards/visa.svg');
    case 'American Express':
      return require('assets/svg/cards/american-express.svg');
    case 'Diners Club':
      return require('assets/svg/cards/diners-club.svg');
    case 'Discover':
      return require('assets/svg/cards/discover.svg');
    case 'JCB':
      return require('assets/svg/cards/jcb.svg');
    case 'UnionPay':
      return require('assets/svg/cards/union-pay.svg');
    case 'Maestro':
      return require('assets/svg/cards/maestro.svg');
    default:
      return null;
  }
};

const Card = ({ brand, last_4, exp_month, exp_year, updateCard, removeCard, style }) => {
  const icon = getCardIcon(brand);
  return (
    <Container style={style}>
      <div className="d-flex flex-column justify-content-between h-100">
        <Brand>{icon ? <SvgRender path={icon} style={{ height: 34 }} /> : brand}</Brand>
        <Bottom>
          <div className="d-flex align-items-center mb-3">
            <div className="mr-2">
              <Dot />
              <Dot />
              <Dot />
              <Dot />
            </div>
            <div className="mr-2">
              <Dot />
              <Dot />
              <Dot />
              <Dot />
            </div>
            <div className="mr-2">
              <Dot />
              <Dot />
              <Dot />
              <Dot />
            </div>
            <div>{last_4}</div>
          </div>
          <div>
            {exp_month}/{exp_year}
          </div>
        </Bottom>
      </div>
      <div className="slider">
        <Checkout onToken={updateCard} description="Change payment method" label="Change">
          <Button style={{ width: 344, height: 182 }}>UPDATE INFO</Button>
        </Checkout>
      </div>
    </Container>
  );
};
export default Card;

const Brand = styled('div')`
  font-size: ${variables.size20};
  font-weight: 600;
  text-transform: uppercase;
`;

const Bottom = styled('div')`
  font-family: monospace;
`;

const Dot = styled('div')`
  display: inline-block;

  width: 6px;
  height: 6px;
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
  border-radius: 50%;

  background: ${variables.head};
`;
