import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { Formik, Form } from 'formik';

import Header from 'components/layouts/header';

import Input from 'components/inputs';
import SvgRender from 'components/general/SvgRender';
import apparatus_logo from 'assets/svg/apparatus/logo.svg';
import DeleteCollapse from 'components/general/DeleteCollapse';
import { createValidationSchema } from 'utils/validator';
import { FormsBreakpointsClasses } from 'utils/media';
import variables from 'assets/sass/partials/_exports.scss';
import { editUser, deleteUser, syncUser } from './_actions';

const properties = {
  name: { type: 'text', validations: { required: true } }
  // photo: { type: 'text', validations: { required: 'Avatar is a required field' } }
};
const schemaValidation = createValidationSchema(properties);

const DeleteAcount = connect(
  null,
  { deleteAction: deleteUser }
)(DeleteCollapse);

export class AccountWizard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      photo: '',
      savePending: false
    };
  }

  render() {
    const { user, syncUser, directive_id } = this.props;

    return (
      <div className="row">
        <div className={FormsBreakpointsClasses}>
          <Header title={`Profile`} menu={[]} />

          {directive_id ? (
            <Fragment>
              <button
                className={`btn btn-small ${SyncButton}`}
                onClick={() => {
                  syncUser({ directive_id }).then(data => {
                    if (data && data.user) {
                      this.setState({
                        name: data.user && data.user.name ? data.user.name : '',
                        photo: data.user && data.user.photo ? data.user.photo : '',
                        savePending: true
                      });
                    }
                  });
                }}
              >
                <div className="d-flex align-items-center">
                  <SvgRender style={{ height: 15 }} path={apparatus_logo} className="mr-1" />
                  Sync Data With Apparatus
                </div>
              </button>
              <br />
              {this.state.savePending && (
                <small className="mt-1 mb-0 ">
                  Click the Save button to save the Apparatus updates
                </small>
              )}
              <div className="mb-4" />
            </Fragment>
          ) : null}

          <Formik
            initialValues={{
              name: this.state.savePending ? this.state.name : user && user.name ? user.name : '',
              photo: this.state.savePending
                ? this.state.photo
                : user && user.photo
                ? user.photo
                : ''
            }}
            enableReinitialize={true}
            validationSchema={schemaValidation}
            onSubmit={values => {
              this.props.editUser({ name: values.name, photo: values.photo }).then(() => {
                this.setState({ savePending: false });
              });
            }}
            render={({ setFieldValue, handleChange, values, touched, errors }) => (
              <Form>
                <Input
                  id="team-name-field"
                  value={values.name}
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  touched={touched.name}
                  error={errors.name}
                />
                <Input
                  tag="photo"
                  value={values.photo}
                  label="Avatar"
                  name="photo"
                  onChange={setFieldValue}
                  touched={touched.photo}
                  error={errors.photo}
                />
                <div className="row">
                  <div className="col-12 text-right">
                    <button type="submit" className="btn btn-success mt-1 pr-4 pl-4">
                      Save
                    </button>
                  </div>
                </div>
              </Form>
            )}
          />
          <hr className="mt-6 mb-4" />
          <DeleteAcount
            collapseHeader="Close Account"
            collapseBody={
              <div>
                <p className="mb-1">Closing an account has the following effects:</p>
                <ul className="mb-1 pl-3">
                  <li className="mb-1">
                    All of your shared files within a team will be tranfered to the owner of the
                    team.
                  </li>
                  <li className="mb-1">
                    Files that you haven't shared but are saved inside a team folder, will be
                    transferred to the owner of the team.
                  </li>
                  <li>All your files that are not shared with a team will be lost.</li>
                </ul>
                <b>If you are an owner, you cannot close your account.</b>
              </div>
            }
            buttonText="Close Account"
            modalHeader="Close Account"
            modalBody={
              <p>
                You are about to close your Ybit Account. You will not be able to recover your
                account or files.
                <b>This operation cannot be undone.</b>
              </p>
            }
          />
        </div>
      </div>
    );
  }
}

const SyncButton = css`
  background-color: #fff;
  border: 1px solid #e0e6ed;
  border-radius: 3px;
  color: ${variables.head};
  padding-left: ${variables.size24};
  padding-right: ${variables.size24};

  transition: background-color 0.15s ease-in-out;
  &:hover {
    background-color: ${variables.selected};
    color: ${variables.head};
    border: 1px solid #e0e6ed;
    border-radius: 3px;
  }
`;

function mapStateToProps(state) {
  return {
    user: state.user,
    directive_id: state.auth.directive_id
  };
}

export default connect(
  mapStateToProps,
  { editUser, deleteUser, syncUser }
)(AccountWizard);
