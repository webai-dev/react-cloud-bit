import React, { Component } from 'react';
import InstancesTable from '../instances/InstancesTable';
import TypeDetails from './TypeDetails';
import { Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { FormsBreakpointsClasses } from 'utils/media';

class Type extends Component {
  render() {
    const { type, loaded } = this.props;

    if (!type) {
      return <Redirect to="/sandbox" />;
    }

    return (
      <div className="container ml-0">
        <Row>
          <Col xs="7">
            <InstancesTable type={type} />
          </Col>
        </Row>
        <Row className="mt-7">
          <Col xs="7">
            <TypeDetails type={type} />
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    type: state.sandbox.types.find(type => type.id == ownProps.match.params.typeId)
  };
};
export default compose(
  withRouter,
  connect(mapStateToProps)
)(Type);
