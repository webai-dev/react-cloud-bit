import React from 'react';

import StripeCheckout from 'react-stripe-checkout';

const stripeKey = process.env.REACT_APP_STRIPE_KEY;
const Checkout = ({ description, label, onToken, children }) => (
  <StripeCheckout
    stripeKey={stripeKey}
    token={onToken}
    name="yBit"
    image={require('assets/img/logo.png')}
    description={description}
    panelLabel={label}
    zipCode
    billingAddress
  >
    {children}
  </StripeCheckout>
);
export default Checkout;
