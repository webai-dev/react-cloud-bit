import React, { Component } from 'react';

import Header from 'components/layouts/header';

import InvitationsList from 'views/invitations/InvitationsList';
import { FormsBreakpointsClasses } from 'utils/media';

class AccountInvitations extends Component {
  render() {
    return (
      <div className="content-inner-wrapper">
        <div className="row">
          <div className={FormsBreakpointsClasses}>
            <Header title={`Invitations`} menu={[]} />

            <InvitationsList accountView={true} />
          </div>
        </div>
      </div>
    );
  }
}

export default AccountInvitations;
