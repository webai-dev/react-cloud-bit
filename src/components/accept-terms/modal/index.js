import React, { Component } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import TermsTabs from './TermsTabs';
import TermsForm from './TermsForm';
import { addBlurClassToBody, removeBlurClassFromBody } from 'utils/functions';

class Terms extends Component {
  render() {
    const { hasAcceptedYbitTerms, hasAcceptedApparatusTerms, showModal, onAccept } = this.props;

    return showModal ? (
      <Modal
        isOpen={showModal}
        className="terms-modal legal-wrapper"
        onEnter={addBlurClassToBody}
        onExit={removeBlurClassFromBody}
      >
        <div className="tab-content">
          <div className="tab-pane active">
            <TermsTabs
              hasAcceptedYbitTerms={hasAcceptedYbitTerms}
              hasAcceptedApparatusTerms={hasAcceptedApparatusTerms}
            />
            <TermsForm
              hasAcceptedYbitTerms={hasAcceptedYbitTerms}
              hasAcceptedApparatusTerms={hasAcceptedApparatusTerms}
              onAccept={onAccept}
            />
          </div>
        </div>
      </Modal>
    ) : null;
  }
}
export default Terms;
