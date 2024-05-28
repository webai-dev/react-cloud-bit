import React, { Component } from 'react';
import DeleteType from './DeleteType';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { connect } from 'react-redux';
import { deleteSandboxType } from 'views/sandbox/_actions';

class TypeDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deletionModalIsOpened: null
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  showModal() {
    this.setState({ deletionModalIsOpened: true });
  }

  hideModal() {
    this.setState({ deletionModalIsOpened: false });
  }

  render() {
    const { type, deleteSandboxType } = this.props;
    const { deletionModalIsOpened } = this.state;

    return (
      <div>
        <div>
          <p className="size-18 font-weight-bold">{type.name} Details</p>
        </div>
        <div className="mb-1">
          <div className="font-weight-bold">Base url:</div>
          <div className="size-14">{type.base_url}</div>
        </div>
        <div className="mb-1">
          <div className="font-weight-bold">Display url:</div>
          <div className="size-14">{type.display_url}</div>
        </div>
        <Row className="mb-1">
          <Col>
            <div className="font-weight-bold">Width:</div>
            <div className="size-14">{type.width}</div>
          </Col>
          <Col>
            <div className="font-weight-bold">Height:</div>
            <div className="size-14">{type.height}</div>
          </Col>
        </Row>
        <div className="mb-1">
          <div className="font-weight-bold">JWT Secret:</div>
          <div className="size-14 word-break-all">{type.jwt_key}</div>
        </div>
        <div className="mb-1">
          <div className="font-weight-bold">Fullscreen:</div>
          <div className="size-14">{type.fullscreen ? 'Yes' : 'No'}</div>
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <button type="button" className="btn btn-remove-link" onClick={this.showModal}>
            Delete
          </button>

          <Link
            className="btn btn-success ml-4 pr-4 pl-4 d-flex align-items-center"
            to={`/sandbox/types/${type.id}/edit`}
          >
            Edit
          </Link>
        </div>

        {deletionModalIsOpened && (
          <DeleteType
            type={type}
            deleteSandboxType={deleteSandboxType}
            hideModal={this.hideModal}
          />
        )}
      </div>
    );
  }
}

export default connect(
  null,
  { deleteSandboxType }
)(TypeDetails);
