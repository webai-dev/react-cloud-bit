import React, { Component } from 'react';
import Input from 'components/inputs';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Formik, Form } from 'formik';

import Yup from 'yup';

import { FormsBreakpointsClasses } from 'utils/media';

export default class TypeForm extends Component {
  render() {
    const { initialValues, onSubmit, mode } = this.props;
    const cancelLink = mode === 'edit' ? `/sandbox/types/${initialValues.id}` : '/sandbox';

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(),
          base_url: Yup.string()
            .required('Base url is a required field')
            .url('Base url must be a valid URL'),
          display_url: Yup.string()
            .required('Display url is a required field')
            .url('Display url must be a valid URL'),
          width: Yup.number()
            .required()
            .positive()
            .integer()
            .min(1)
            .max(6),
          height: Yup.number()
            .required()
            .positive()
            .integer()
            .min(1)
            .max(6),

          ...(this.props.mode === 'edit' && {
            jwt_key: Yup.string().required('JWT Secret is a required field')
          })
        })}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
        }}
        render={({ setFieldValue, handleChange, values, touched, errors, isSubmitting }) => (
          <Form>
            <div className="row">
              <div className={FormsBreakpointsClasses}>
                <p className="size-18">
                  {mode === 'create' ? (
                    'Create New Bit Type'
                  ) : (
                    <span>
                      Edit Bit Type <span className="font-weight-bold">{initialValues.name}</span>
                    </span>
                  )}
                </p>
                <Input
                  name="name"
                  label="Name"
                  tag="text"
                  onChange={handleChange}
                  value={values.name}
                  touched={touched.name}
                  error={errors.name}
                />
                <Input
                  name="base_url"
                  label="Base url"
                  onChange={handleChange}
                  value={values.base_url}
                  touched={touched.base_url}
                  error={errors.base_url}
                />
                <Input
                  name="display_url"
                  label="Display url"
                  onChange={handleChange}
                  value={values.display_url}
                  touched={touched.display_url}
                  error={errors.display_url}
                />

                <Input
                  name="jwt_key"
                  label={`${
                    this.props.mode === 'edit'
                      ? 'JWT Secret'
                      : 'JWT Secret (Optional, if empty one will be auto generated)'
                  }`}
                  onChange={handleChange}
                  value={values.jwt_key}
                  touched={touched.jwt_key}
                  error={errors.jwt_key}
                />

                <Row>
                  <Col>
                    <Input
                      name="width"
                      label="Width"
                      onChange={handleChange}
                      value={values.width}
                      touched={touched.width}
                      error={errors.width}
                    />
                  </Col>
                  <Col>
                    <Input
                      name="height"
                      label="Height"
                      onChange={handleChange}
                      value={values.height}
                      touched={touched.height}
                      error={errors.height}
                    />
                  </Col>
                </Row>

                <div className="d-flex justify-content-end">
                  <Link
                    className="d-flex align-items-center btn btn-remove-link mt-1 pr-4 pl-4"
                    to={cancelLink}
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    className={`btn btn-success mt-1 pr-4 pl-4 ${
                      isSubmitting ? 'pointer-events-none' : ''
                    }`}
                  >
                    {isSubmitting ? 'Saving ...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      />
    );
  }
}
