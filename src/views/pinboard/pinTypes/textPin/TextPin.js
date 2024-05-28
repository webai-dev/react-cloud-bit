import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';

import Input from 'components/inputs';

import { createPin, editPin } from '../../_actions';

class TextPin extends Component {
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
          content:
            this.props.pin.content && this.props.pin.content.content
              ? this.props.pin.content.content
              : ''
        }}
        enableReinitialize={true}
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
              tag="editor"
              label="Text"
              onChange={setFieldValue}
              name="content"
              touched={touched.content}
              error={errors.content}
              value={values.content}
              id="textPinContent"
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
)(TextPin);
