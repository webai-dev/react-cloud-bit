import React, { Component } from 'react';
import SimpleModal from 'components/modals/SimpleModal';
import Input from 'components/inputs';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue ? this.props.initialValue : '' };
  }

  handleChange = e => this.setState({ value: e.target.value });

  render() {
    const { isOpen, onClose, onConfirm } = this.props;
    const { value } = this.state;

    return (
      <SimpleModal
        header="Rename Version"
        body={
          <div className="modal-body">
            <Input value={value} label="Version name" onChange={this.handleChange} />
            <div className="modal-footer text-right">
              <button
                className="btn btn-success mt-2 pr-4 pl-4"
                onClick={() => {
                  onConfirm(value);
                  onClose();
                }}
              >
                Save
              </button>
              <button type="button" className="btn btn-remove-link mt-2 ml-4" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        }
        modalOpen={isOpen}
        toggle={onClose}
      />
    );
  }
}
export default Modal;
