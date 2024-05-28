import React from 'react';
import BillingSummary from './BillingSummary';
import CancelMessage from './CancelMessage';

const Summary = props =>
  !['free', 'plans_storage'].includes(props.planId) ? (
    <BillingSummary {...props} />
  ) : (
    <CancelMessage {...props} type={props.planId === 'free' ? 'main' : 'storage'} />
  );
export default Summary;
