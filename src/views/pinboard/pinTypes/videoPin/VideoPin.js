import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';

import Input from 'components/inputs';
import { createValidationSchema } from 'utils/validator';

import { createPin, editPin } from '../../_actions';

const properties = {
  title: { type: 'text', validations: { required: true } },
  url: { type: 'text', validations: { required: true, url: true } }
};
const schemaValidation = createValidationSchema(properties);

export class VideoPin extends Component {
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
          url:
            this.props.pin.content && this.props.pin.content.url ? this.props.pin.content.url : '',
          title:
            this.props.pin.content && this.props.pin.content.title
              ? this.props.pin.content.title
              : ''
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
              label="Title"
              name="title"
              id="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              touched={touched.title}
              error={errors.title}
            />
            <Input
              label="URL"
              name="url"
              id="url"
              type="url"
              value={values.url}
              onChange={handleChange}
              touched={touched.url}
              error={errors.url}
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
)(VideoPin);
