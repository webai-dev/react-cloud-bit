import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import SvgRender from 'components/general/SvgRender';
import { Collapse, Card, CardBody, Button } from 'reactstrap';

import arrow from 'assets/svg/general/arrow.svg';
import Input from 'components/inputs';
import SimpleModal from '../modals/SimpleModal';

import variables from 'assets/sass/partials/_exports.scss';

class DeleteCollapse extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);

    this.state = { collapse: false, modalVisible: false };
  }

  toggle() {
    this.setState(prevState => ({ collapse: !prevState.collapse }));
  }

  toggleModal() {
    this.setState(prevState => ({ modalVisible: !prevState.modalVisible }));
  }

  render() {
    const {
      collapseHeader,
      collapseBody,
      modalHeader,
      modalBody,
      buttonText,
      deleteActionParams
    } = this.props;

    return (
      <CollapseWrapper className="mb-2">
        <Card>
          <CardBody onClick={this.toggle}>
            <div className="d-flex justify-content-between align-items-center">
              <CardHeader>{collapseHeader}</CardHeader>
              <div className={this.state.collapse ? IconOpen : IconClose}>
                <SvgRender
                  style={{ height: 17 }}
                  className="icon"
                  wrapperClassName={IconWrapper}
                  path={arrow}
                />
              </div>
            </div>
          </CardBody>
          <Collapse isOpen={this.state.collapse}>
            <CardBody>
              <Content>{collapseBody}</Content>
              <DeleteButton>
                <Button className={CloseButton} onClick={this.toggleModal}>
                  {buttonText}
                </Button>
              </DeleteButton>
            </CardBody>
          </Collapse>
        </Card>
        <ConfirmModal
          isOpen={this.state.modalVisible}
          header={modalHeader}
          body={modalBody}
          submitDeletion={() => {
            this.props.deleteAction(deleteActionParams);
          }}
          closeModal={this.toggleModal}
        />
      </CollapseWrapper>
    );
  }
}

class ConfirmModal extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.checkSubmition = this.checkSubmition.bind(this);

    this.state = { confirmationField: '', showError: false };
  }

  handleChange(e) {
    this.setState({ confirmationField: e.target.value });
  }

  checkSubmition() {
    if (this.state.confirmationField == 'delete') {
      this.props.submitDeletion();
      this.props.closeModal();
    } else {
      this.setState({ confirmationField: '', showError: true });
    }
  }

  render() {
    const { isOpen, header, body, closeModal } = this.props;
    const { confirmationField, showError } = this.state;

    return (
      <SimpleModal
        modalOpen={isOpen}
        header={<ModalHeader>{header}</ModalHeader>}
        body={
          <ModalBody>
            {body}
            <div className="container">
              <div className="row align-items-center mb-1">
                <p className="mr-2">Type "delete" to confirm</p>
                <Input
                  value={confirmationField}
                  name="confirm"
                  onChange={e => this.handleChange(e)}
                  touched={this.state.showError}
                />
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
                    onClick={this.checkSubmition}
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

export default DeleteCollapse;

const CollapseWrapper = styled('div')`
  background-color: #fff;
  border: 1px solid #e0e6ed;
  border-radius: 3px;
`;

const CardHeader = styled('div')`
  padding-left: ${variables.size16};
  padding-right: ${variables.size16};
  padding-top: ${variables.size12};
  padding-bottom: ${variables.size12};
  font-size: ${variables.size14};
  color: ${variables.red};
`;

const IconWrapper = css`
  padding-right: ${variables.size14};
  padding-left: ${variables.size14};
  height: 17px;
`;

const IconOpen = css`
  transform: rotate(180deg);
  transition: transform 0.25s ease-in-out;
`;

const IconClose = css`
  transition: transform 0.25s ease-in-out;
`;

const Content = styled('div')`
  padding-right: ${variables.size16};
  padding-left: ${variables.size16};
  padding-bottom: ${variables.size16};
  padding-right: ${variables.size16};
  font-size: ${variables.size12};
  margin: 0rem;
`;

const DeleteButton = styled('div')`
  background-color: #fff;
  border-top: 1px solid #e0e6ed;
  border-radius: 3px;
  padding: ${variables.size16};
  display: flex;
  justify-content: flex-end;
`;

const CloseButton = css`
  background-color: ${variables.red};
  padding-left: 2rem;
  padding-right: 2rem;
  transition: background-color 0.15s ease-in-out;
  &:hover {
    background-color: #b34343;
  }
`;

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
