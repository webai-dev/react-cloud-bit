import variables from 'assets/sass/partials/_exports.scss';
import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Modal, ModalHeader } from 'reactstrap';
import { minWidth } from 'utils/media';

class SimpleModal extends Component {
  render() {
    return (
      <Modal
        modalClassName={`${SimpleModalClass} ${
          this.props.modalClassName && this.props.modalClassName !== undefined
            ? this.props.modalClassName
            : ''
        }`}
        isOpen={this.props.modalOpen}
        toggle={this.props.toggle}
        className={
          this.props.className && this.props.className !== undefined ? this.props.className : ''
        }
        id="modal-root"
      >
        {this.props.headerActions ? (
          this.props.header
        ) : (
          <ModalHeader toggle={this.props.toggle}>{this.props.header}</ModalHeader>
        )}

        {this.props.body}
      </Modal>
    );
  }
}

export default SimpleModal;

const SimpleModalClass = css`
  .modal-dialog {
    margin-top: ${variables.size4};
    width: 100%;

    ${minWidth.xs + '{ max-width: 90%; }'};
    ${minWidth.lg + '{ max-width: 60%; }'};
    ${minWidth.xl + '{ max-width: 568px; }'};

    .modal-content {
      border-radius: ${variables.borderRadiusBase};
      border: none;

      font-size: ${variables.size14};
      .modal-header {
        border-radius: ${variables.borderRadiusBase};
        padding: ${variables.size24} ${variables.size32};
        border-color: ${variables.linesGray};

        .modal-title {
          color: ${variables.textHead};
          font-size: ${variables.size18};
          font-weight: 400;
        }

        .close {
          background: none;
          border: none;
          outline: none;
          cursor: pointer;

          span {
            color: ${variables.textSec};
            font-size: ${variables.size24};
            font-weight: 400;
          }
        }
      }

      .modal-body {
        padding: ${variables.size24} ${variables.size24} ${variables.size16} ${variables.size24};
      }

      .modal-footer {
        padding: ${variables.size24};
        border-top: 0;
      }
    }
  }
  .modal-backdrop {
    background-color: rgba(60, 72, 88, 0.7);
  }
`;
