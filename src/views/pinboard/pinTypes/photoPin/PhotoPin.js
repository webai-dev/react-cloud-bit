import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';

import Input from 'components/inputs';
import { createValidationSchema } from 'utils/validator';

import FileUpload from 'components/general/FileUpload';
import { createPin, editPin } from '../../_actions';

const properties = {
  title: { type: 'text', validations: { required: true } },
  url: { type: 'text', validations: { required: 'Photo is a required field', url: true } }
};
const schemaValidation = createValidationSchema(properties);

export class PhotoPin extends Component {
  constructor(props) {
    super(props);

    this.handleRedirect = this.handleRedirect.bind(this);
  }
  handleRedirect() {
    this.props.history.push(`/pinboard`);
  }
  render() {
    const { teamId, typeId } = this.props;

    return (
      <Formik
        initialValues={{
          title:
            this.props.pin.content && this.props.pin.content.title
              ? this.props.pin.content.title
              : '',
          url:
            this.props.pin.content && this.props.pin.content.url ? this.props.pin.content.url : ''
        }}
        validationSchema={schemaValidation}
        onSubmit={values => {
          let params = { type_id: typeId, team_id: teamId, content: values };

          if (this.props.pin.id) {
            params.id = this.props.pin.id;

            this.props.editPin(params).then(data => {
              if (data) this.handleRedirect();
            });
          } else {
            this.props.createPin(params).then(data => {
              if (data) this.handleRedirect();
            });
          }
        }}
        render={({ setFieldValue, handleChange, values, touched, errors, isSubmitting }) => (
          <Form>
            <Input
              id="title"
              value={values.title}
              label={'Title'}
              name="title"
              onChange={handleChange}
              touched={touched.title}
              error={errors.title}
            />
            <FileUpload
              onChange={setFieldValue}
              name="url"
              value={
                this.props.pin.content && this.props.pin.content.url
                  ? this.props.pin.content.url
                  : null
              }
            />
            <div className="row">
              <div className="col-12 text-right mt-1">
                <button type="submit" className="btn btn-success pr-2 pl-2">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-remove-link mt-1 ml-2"
                  onClick={this.handleRedirect}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    teamId: state.teams.active.id,
    pin:
      ownProps.pinId !== undefined &&
      state.pinboard.active &&
      state.pinboard.active.id &&
      state.pinboard.active.id === parseInt(ownProps.pinId)
        ? state.pinboard.active
        : {}
  };
}

export default connect(
  mapStateToProps,
  { createPin, editPin }
)(PhotoPin);
