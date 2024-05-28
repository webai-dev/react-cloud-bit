import React, { Component } from 'react';
import TypeForm from './TypeForm';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { editSandboxType } from 'views/sandbox/_actions';

class EditType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edited: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const params = {
      name: values.name,
      base_url: values.base_url,
      display_url: values.display_url,
      width: values.width,
      height: values.height,
      jwt_key: values.jwt_key
    };

    this.props.editSandboxType(this.props.type.id, params).then(response => {
      this.setState({ edited: true });
    });
  }

  render() {
    const { type, loaded } = this.props;
    const { edited } = this.state;

    if (edited) {
      return <Redirect to={`/sandbox/types/${type.id}`} />;
    }

    return (
      <div>
        <TypeForm initialValues={type} onSubmit={this.handleSubmit} mode="edit" />
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
  connect(
    mapStateToProps,
    { editSandboxType }
  )
)(EditType);
