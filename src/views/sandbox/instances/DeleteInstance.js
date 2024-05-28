import React from 'react';
import SimpleModal from 'components/modals/SimpleModal';

const DeleteInstance = ({ instance, deleteSandboxInstance, hideModal }) => {
  return (
    <SimpleModal
      header="Delete Instance"
      body={
        <div className="mx-4 mt-4 mb-3">
          <div>
            <span>
              You are about to delete instance:{' '}
              <span className="font-weight-bold">{instance.name}</span>
            </span>
          </div>
          <div>Are you sure you want to continue?</div>
          <div className="d-flex justify-content-end mt-4">
            <button type="button" className="btn btn-remove-link mr-4" onClick={hideModal}>
              Cancel
            </button>
            <button
              className="btn btn-danger pr-4 pl-4"
              onClick={() => {
                deleteSandboxInstance(instance.type_id, instance.id).then(res => hideModal());
              }}
            >
              Continue
            </button>
          </div>
        </div>
      }
      modalOpen={true}
      toggle={this.hideModal}
    />
  );
};

export default DeleteInstance;
