import React, { Component } from 'react';

import { Formik, Form } from 'formik';
import Yup from 'yup';

import { ButtonRow, Button } from '../common';
import StepDisplay from './StepDisplay';
import Input from 'components/inputs';
class Step1 extends Component {
  state = { hasSubmited: false };

  render() {
    const { goBack, setFields, nextStep } = this.props;
    const { hasSubmited } = this.state;

    return (
      <Formik
        initalValues={{ firstName: '', lastName: '', email: '' }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().required(),
          lastName: Yup.string().required(),
          email: Yup.string()
            .email()
            .required()
        })}
        onSubmit={values => {
          setFields({ ...values });
          nextStep();
        }}
        render={props => (
          <Form
            onSubmit={e => {
              this.setState({ hasSubmited: true });
              props.handleSubmit(e);
            }}
          >
            <StepDisplay step={1} of={2} />
            <div style={{ maxWidth: 360 }}>
              <Input
                tag="text"
                label="First Name"
                name="firstName"
                value={props.values.firstName}
                touched={hasSubmited || props.touched.firstName}
                error={props.errors.firstName}
                onChange={props.handleChange}
              />
              <Input
                tag="text"
                label="Last Name"
                name="lastName"
                value={props.values.lastName}
                touched={hasSubmited || props.touched.lastName}
                error={props.errors.lastName}
                onChange={props.handleChange}
              />
              <Input
                tag="email"
                label="Company Email"
                name="email"
                value={props.values.email}
                touched={hasSubmited || props.touched.email}
                error={props.errors.email}
                onChange={props.handleChange}
              />
            </div>
            <ButtonRow>
              <Button type="button" className="btn btn-icon-inactive" onClick={goBack}>
                Cancel
              </Button>
              <Button type="submit" className="btn btn-success">
                Continue
              </Button>
            </ButtonRow>
          </Form>
        )}
      />
    );
  }
}
export default Step1;
