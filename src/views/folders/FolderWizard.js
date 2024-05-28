import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';

import Input from 'components/inputs';
import { createValidationSchema } from 'utils/validator';

import { fetchShare } from 'views/shares/_actions';
import { createFolder } from './_actions';

const properties = {
  title: { type: 'text', validations: { required: 'Name is a required field' } }
};
const schemaValidation = createValidationSchema(properties);

class FolderWizard extends Component {
  constructor(props) {
    super(props);

    this.state = { submittedValues: {} };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }

  handleRedirect() {
    if (this.props.active_folder) this.props.history.push(`/folder/${this.props.active_folder}`);
    else this.props.history.goBack();
  }

  handleSubmit(title) {
    let params = {
      title,
      team_id: this.props.active_team.id
    };

    if (this.props.active_folder) {
      params.folder_id = this.props.active_folder;
    }

    this.props.createFolder(params).then(data => {
      if (data && data.id) {
        if (this.props.active_folder) {
          this.props.history.push(`/folder/${this.props.active_folder}`);
        } else {
          this.props.history.goBack();
        }
      }
    });
  }

  render() {
    return (
      <Formik
        initialValues={{ title: '' }}
        validationSchema={schemaValidation}
        onSubmit={values => {
          this.handleSubmit(values.title);
        }}
        render={({ setFieldValue, handleChange, values, touched, errors, isSubmitting }) => (
          <Form>
            <div className="row">
              <div className="col-12 ">
                <Input
                  id="folder-name-field"
                  value={values.title}
                  label={this.props.active_folder ? 'Name' : 'Folder Name'}
                  name="title"
                  onChange={handleChange}
                  touched={touched.title}
                  error={errors.title}
                />
              </div>
              <div className="col-12 text-right mt-2">
                <button type="submit" className="btn btn-success pr-4 pl-4" disabled={isSubmitting}>
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-remove-link mt-2 ml-4"
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

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    active_folder: state.folders.active
  };
}

export default connect(
  mapStateToProps,
  {
    createFolder,
    fetchShare
  }
)(FolderWizard);
