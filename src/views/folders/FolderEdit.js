import Input from 'components/inputs';
import { Form, Formik } from 'formik';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createValidationSchema } from 'utils/validator';
import { renameFolder } from './_actions';

const properties = {
  title: { type: 'text', validations: { required: true } }
};
const schemaValidation = createValidationSchema(properties);

class FolderEdit extends Component {
  render() {
    const { folder } = this.props;

    return (
      <React.Fragment>
        <Formik
          initialValues={{ title: folder.title }}
          validationSchema={schemaValidation}
          onSubmit={values => {
            const params = {
              title: values.title,
              team_id: this.props.active_team.id,
              id: folder.id
            };

            this.props.renameFolder(params).then(data => {
              if (data) this.props.toggle();
            });
          }}
          render={({ setFieldValue, handleChange, values, touched, errors, isSubmitting }) => (
            <Form>
              <div className="modal-body">
                <Input
                  id="folder-title"
                  value={values.title}
                  label="Title"
                  name="title"
                  onChange={handleChange}
                  touched={touched.title}
                  error={errors.title}
                />
              </div>
              <div className="modal-footer text-right">
                <button
                  type="submit"
                  className="btn btn-success mt-2 pr-4 pl-4"
                  disabled={isSubmitting}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-remove-link mt-2 ml-4"
                  onClick={this.props.toggle}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return { active_team: state.teams.active };
}

export default connect(
  mapStateToProps,
  { renameFolder }
)(FolderEdit);
