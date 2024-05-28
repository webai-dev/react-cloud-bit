import React, { Component } from 'react';
import Checkbox from 'components/inputs/CheckBox';
import { Button } from 'reactstrap';

export default class TermsForm extends Component {
  state = {
    ybitAccepted: this.props.hasAcceptedYbitTerms,
    apparatusAccepted: this.props.hasAcceptedApparatusTerms,
    isSubmitting: false
  };

  toggleCheckBox(name, value) {
    this.setState({ [name]: value });
  }

  render() {
    const { hasAcceptedYbitTerms, hasAcceptedApparatusTerms, onAccept } = this.props;
    const { ybitAccepted, apparatusAccepted, isSubmitting } = this.state;

    return (
      <div className="terms-form d-flex justify-content-between align-items-end">
        <div>
          {!hasAcceptedYbitTerms && (
            <div
              className={`className d-flex algin-items-center ${
                !hasAcceptedApparatusTerms ? 'mb-2' : ''
              }`}
            >
              <Checkbox
                value={ybitAccepted}
                label="I agree to the Terms & Conditions / Privacy Policy of Ybit"
                className="mb-0 mr-2"
                handleClick={() => this.toggleCheckBox('ybitAccepted', !ybitAccepted)}
              />
            </div>
          )}

          {!hasAcceptedApparatusTerms && (
            <div className="className d-flex algin-items-center">
              <Checkbox
                value={apparatusAccepted}
                label="I agree to the Terms & Conditions / Privacy Policy of Apparatus"
                className="mb-0 mr-2"
                handleClick={() => this.toggleCheckBox('apparatusAccepted', !apparatusAccepted)}
              />
            </div>
          )}
        </div>

        <Button
          color="black"
          disabled={!ybitAccepted || !apparatusAccepted || isSubmitting}
          onClick={() => {
            this.setState({ isSubmitting: true });
            onAccept();
          }}
        >
          Proceed
        </Button>
      </div>
    );
  }
}
