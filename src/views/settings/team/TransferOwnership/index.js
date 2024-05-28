import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import SvgRender from 'components/general/SvgRender';
import { Collapse, Card, CardBody, Button } from 'reactstrap';
import arrow from 'assets/svg/general/arrow.svg';
import variables from 'assets/sass/partials/_exports.scss';

import ConfirmModal from './ConfirmModal';

class TransferOwnership extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      showModal: false
    };
  }

  toggle = property => () => {
    this.setState(prevState => ({ [property]: !prevState[property] }));
  };

  render() {
    const { collapse, showModal } = this.state;
    return (
      <CollapseWrapper className="mb-2">
        <Card>
          <CardBody onClick={this.toggle('collapse')}>
            <div className="d-flex justify-content-between align-items-center">
              <CardHeader>Transfer Ownership</CardHeader>
              <div className={collapse ? IconOpen : IconClose}>
                <SvgRender
                  style={{ height: 17 }}
                  className="icon"
                  wrapperClassName={IconWrapper}
                  path={arrow}
                />
              </div>
            </div>
          </CardBody>
          <Collapse isOpen={collapse}>
            <CardBody>
              <Content>
                <div>
                  <p>Transfering Ownership your profile has the following effects:</p>
                  <ul>
                    <li>Your role when you do the change will be Administrator.</li>
                    <li>As an administrator you can't delete the team.</li>
                    <li>
                      As an administrator you don't have access to Plans and in Billing pages.
                    </li>
                  </ul>
                  <b>This action is irreversible.</b>
                </div>
              </Content>
              <ButtonWrapper>
                <Button className={CloseButton} onClick={this.toggle('showModal')}>
                  Tranfer Ownership
                </Button>
              </ButtonWrapper>
            </CardBody>
          </Collapse>
        </Card>
        <ConfirmModal isOpen={showModal} closeModal={this.toggle('showModal')} />
      </CollapseWrapper>
    );
  }
}
export default TransferOwnership;

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

const ButtonWrapper = styled('div')`
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
