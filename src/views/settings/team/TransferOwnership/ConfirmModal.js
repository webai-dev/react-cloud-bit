import React, { Component } from 'react';
import { connect } from 'react-redux';
import SimpleModal from 'components/modals/SimpleModal';
import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import SelectUser from 'components/inputs/SelectUser';
import { apiService } from 'utils/api';
import { successHandler, errorHandler, MSG } from 'utils/alerts';

class ConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedUser: null };
  }

  selectUser = user => {
    this.setState({ selectedUser: user });
  };

  submit = () => {
    const { selectedUser } = this.state;
    if (!selectedUser || !selectedUser.value) {
      return;
    }

    this.transferOwnership(selectedUser.value);
  };

  transferOwnership = targetUser => {
    return apiService
      .put(`/teams/${this.props.active_team}/transfer`, { user_id: targetUser })
      .then(() => this.props.successMsg(MSG.TEAM_OWNERSHIP_TRANSFERED))
      .catch(error => this.props.errorMsg(error))
      .finally(() => this.props.closeModal());
  };

  render() {
    const { isOpen, closeModal } = this.props;
    const { selectedUser } = this.state;
    return (
      <SimpleModal
        modalOpen={isOpen}
        header={<ModalHeader>Transfer Ownership</ModalHeader>}
        body={
          <ModalBody>
            <div className="container">
              <div className="row align-items-center mb-3">
                <p className="mr-2 mb-0">Choose the new owner</p>
                <SelectUser value={selectedUser} onChange={this.selectUser} className={'col p-0'} />
              </div>
              <div className="row">
                <div className="col-12 pl-0 pr-0 text-right">
                  <button
                    type="button"
                    className={'btn btn-light mt-1 pr-4 pl-4 ' + WhiteText + ' ' + ButtonText}
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={'btn btn-success ml-2 mt-1 pr-4 pl-4 ' + ButtonText}
                    onClick={this.submit}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </ModalBody>
        }
      />
    );
  }
}
export default connect(
  ({ teams }) => ({ active_team: teams.active.id }),
  dispatch => ({
    successMsg: message => successHandler(dispatch, message),
    errorMsg: error => errorHandler(dispatch, error)
  })
)(ConfirmModal);

const ModalHeader = styled('div')`
  padding: ${variables.size4};
  font-weight: bold;
`;

const ModalBody = styled('div')`
  padding-top: ${variables.size40};
  padding-bottom: ${variables.size24};
  padding-left: ${variables.size24};
  padding-right: ${variables.size24};
  font-size: ${variables.size14};
`;

const WhiteText = css`
  color: #fff;
`;

const ButtonText = css`
  font-size: ${variables.size14};
`;
