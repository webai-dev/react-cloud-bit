import React, { Component } from 'react';
import Tabs from 'components/general/Tabs';

import { apiService } from 'utils/api';

export default class ApparatusTerms extends Component {
  state = {
    apparatusPolicy: null,
    apparatusTerms: null
  };

  componentDidMount() {
    apiService
      .get('/apparatus/terms', {
        params: { sections: ['privacy_policy', 'terms_and_conditions'] }
      })
      .then(res =>
        this.setState({
          apparatusPolicy: res.data.privacy_policy,
          apparatusTerms: res.data.terms_and_conditions
        })
      );
  }

  render() {
    const { apparatusPolicy, apparatusTerms } = this.state;

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
                <div
                  className="scrollbar h-100"
                  dangerouslySetInnerHTML={{ __html: apparatusPolicy }}
                />
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
                <div
                  className="scrollbar h-100"
                  dangerouslySetInnerHTML={{ __html: apparatusTerms }}
                />
              </div>
            )
          }
        ]}
      />
    );
  }
}
