import React, { Component } from 'react';
import TypeForm from './TypeForm';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { createSandboxType } from 'views/sandbox/_actions';

class CreateType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newType: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    const { name, base_url, display_url, width, height, jwt_key } = values;

    const params = {
      name,
      base_url,
      display_url,
      width,
      height,
      ...(jwt_key && { jwt_key })
    };

    this.props.createSandboxType(params).then(newType => {
      this.setState({ newType });
    });
  }

  render() {
    const { newType } = this.state;
    const initialValues = {
      name: '',
      base_url: '',
      display_url: '',
      width: '',
      height: '',
      jwt_key: ''
    };

    if (newType) {
      return <Redirect to={`/sandbox/types/${newType.id}`} />;
    }

    return (
      <div>
        <TypeForm initialValues={initialValues} onSubmit={this.handleSubmit} mode="create" />
      </div>
    );
  }
}

export default connect(
  null,
  { createSandboxType }
)(CreateType);
