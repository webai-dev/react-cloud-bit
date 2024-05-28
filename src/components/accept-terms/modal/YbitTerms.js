import React, { Component } from 'react';
import Tabs from 'components/general/Tabs';

import PolicyText from 'views/legal/tabs/Policy';
import TermsText from 'views/legal/tabs/Terms';

export default class YbitTerms extends Component {
  render() {
    return (
      <Tabs
        cards={false}
        buttonsClassName="fancy-tabs"
        tabs={[
          {
            button: props => (
              <div {...props}>
                <span>Privacy Policy</span>
              </div>
            ),
            content: () => (
              <div className="terms pr-1">
                <div className="scrollbar h-100">
                  <PolicyText />
                </div>
              </div>
            )
          },
          {
            button: props => (
              <div {...props}>
                <span>Terms & Conditions</span>
              </div>
            ),
            content: () => (
              <div className="terms pr-1">
                <div className="scrollbar h-100">
                  <TermsText />
                </div>
              </div>
            )
          }
        ]}
      />
    );
  }
}
