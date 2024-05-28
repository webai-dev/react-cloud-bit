import React from 'react';

import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

const Plan = ({
  compact,
  interval,
  amount,
  product,
  starting,
  active,
  disabled,
  onClick,
  hideButton
}) => (
  <Container compact={compact}>
    <Top compact={compact}>
      <Title>{product.name}</Title>
      <div className="payment">
        {starting && 'Starting at '}
        <span className="title">${amount / 100}</span>
        {amount > 0 && `/${interval.charAt(0).toUpperCase() + interval.slice(1)}`}
      </div>
    </Top>
    <Description>
      {product.description && product.description.split('.').map(row => <div key={row}>{row}</div>)}
    </Description>
    {!hideButton && disabled ? (
      <CurrentText compact={compact}>Unavailable</CurrentText>
    ) : active ? (
      <CurrentText compact={compact}>Current Plan</CurrentText>
    ) : (
      <button type="button" className={`btn btn-main ${ButtonStyle}`} onClick={onClick}>
        {product.type === 'custom_template' ? 'Contact us' : 'Select'}
      </button>
    )}
  </Container>
);
export default Plan;

const Container = styled('div')`
  height: ${props => (props.compact ? '230px' : '330px')};
  max-width: ${props => (props.compact ? '190px' : '370px')};
  flex-basis: 100%;

  margin-right: ${variables.size32};
  &:last-child {
    margin-right: 0;
  }

  background: white;
  border: 1px solid #e1e7ee;
  border-radius: 3px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  padding: ${variables.size48} ${variables.size16};
  text-align: center;
`;

const Title = styled('div')`
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: ${variables.size8};
`;

const CurrentText = styled('div')`
  color: ${props => (props.compact ? variables.secondary : variables.disabled)};
`;

const Section = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Top = styled(Section)`
  .payment {
    color: ${props => (props.compact ? variables.secondary : 'inherit')};
    .title {
      font-weight: ${props => (props.compact ? 'inherit' : 'bold')};
    }
  }
`;

const Description = styled(Section)`
  color: #a9a9a9;

  div {
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ButtonStyle = css`
  display: flex;
  justify-content: center;
  aling-items: center;
  width: 120px;
  height: ${variables.size32};
`;
