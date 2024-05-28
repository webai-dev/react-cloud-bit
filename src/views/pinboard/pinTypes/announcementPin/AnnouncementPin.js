import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Formik } from 'formik';
import { DEFAULT_API_FORMAT, format } from 'utils/dates';
import Input from 'components/inputs';
import { createValidationSchema } from 'utils/validator';

import { createPin, editPin } from '../../_actions';

const properties = {
  title: { type: 'text', validations: { required: true } },
  date_from: {
    type: 'date',
    validations: { required: 'Date is a required field' }
  },
  date_to: {
    type: 'date',
    validations: { required: 'Date is a required field' }
  }
};
const schemaValidation = createValidationSchema(properties);

export class AnnouncementPin extends Component {
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
          content:
            this.props.pin.content && this.props.pin.content.content
              ? this.props.pin.content.content
              : '',
          date_from:
            this.props.pin.content && this.props.pin.content.date_from
              ? this.props.pin.content.date_from
              : '',
          date_to:
            this.props.pin.content && this.props.pin.content.date_to
              ? this.props.pin.content.date_to
              : ''
        }}
        validationSchema={schemaValidation}
        onSubmit={values => {
          values['date_from'] = format(values['date_from'], DEFAULT_API_FORMAT);
          values['date_to'] = format(values['date_to'], DEFAULT_API_FORMAT);

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
        render={({ setFieldValue, touched, errors, values, handleChange }) => (
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
              tag="date"
              label="Date"
              name="date"
              startDate={values.date_from === '' ? null : values.date_from}
              endDate={values.date_to === '' ? null : values.date_to}
              onChange={setFieldValue}
              startDateId="date_from"
              endDateId="date_to"
              touched={touched.date_from || touched.date_to}
              error={errors.date_from || errors.date_to}
            />
            <Input
              tag="editor"
              label="Text"
              onChange={setFieldValue}
              name="content"
              touched={touched.content}
              error={errors.content}
              value={values.content}
              id="announcementPinContent"
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

const mapStateToProps = (state, ownProps) => ({
  teamId: state.teams.active.id,
  pin:
    ownProps.pinId !== undefined &&
    state.pinboard.active &&
    state.pinboard.active.id &&
    state.pinboard.active.id === parseInt(ownProps.pinId)
      ? state.pinboard.active
      : {}
});

export default connect(
  mapStateToProps,
  { createPin, editPin }
)(AnnouncementPin);
