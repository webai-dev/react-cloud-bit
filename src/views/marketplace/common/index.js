import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export const ButtonRow = styled('div')`
  display: flex;
  margin-top: ${variables.size56};

  button {
    margin-right: ${variables.size16};
    &:last-child {
      margin-right: 0;
    }
  }
`;

export const Button = styled('button')`
  width: 130px;
  height: ${variables.size40};

  display: flex;
  justify-content: center;
  aling-items: center;

  color: white !important;
  font-weight: 600;
`;

export const Title = styled('div')`
  font-size: ${variables.size16};
  font-weight: 600;
`;

export const SecondaryText = styled('div')`
  color: ${variables.secondary};
  font-size: ${variables.size12};
`;

export { default as ContentWrapper } from './ContentWrapper';
export { default as Switch } from './Switch';
export { default as Checkout } from './Checkout';
