import React, { Component } from 'react';
import { connect } from 'react-redux';
import { errorHandler } from 'utils/alerts';
import { Formik, Form } from 'formik';
import Yup from 'yup';

import { ButtonRow, Button } from '../common';
import StepDisplay from './StepDisplay';
import Input from 'components/inputs';
import RadioList from 'components/inputs/RadioList';

const enhance = connect(
  null,
  dispatch => ({
    errorHandler: message => errorHandler(dispatch, message)
  })
);
class Step2 extends Component {
  state = { hasSubmited: false, submiting: false, submitError: null };

  render() {
    const { prevStep, setFields, nextStep, submit, errorHandler } = this.props;
    const { hasSubmited, submiting } = this.state;

    return (
      <Formik
        initalValues={{
          employees: null,
          storage: null,
          customBits: false,
          integration: false
        }}
        validationSchema={Yup.object().shape({
          companyName: Yup.string().required(),
          employees: Yup.string().required(),
          storage: Yup.string().required(),
          customBits: Yup.boolean(),
          integration: Yup.boolean()
        })}
        onSubmit={values => {
          setFields({ ...values }, async () => {
            this.setState({ submiting: true });
            try {
              await submit();
              nextStep();
            } catch (error) {
              errorHandler(error);
            } finally {
              this.setState({ submiting: false });
            }
          });
        }}
        render={props => (
          <Form
            onSubmit={e => {
              this.setState({ hasSubmited: true });
              props.handleSubmit(e);
            }}
          >
            <StepDisplay step={2} of={2} />
            <div style={{ maxWidth: 360 }}>
              <Input
                tag="text"
                label="Company Name"
                name="companyName"
                value={props.values.companyName}
                touched={hasSubmited || props.touched.companyName}
                error={props.errors.companyName}
                onChange={props.handleChange}
              />
              <Input
                tag="select"
                label="Number of Employees at your company"
                name="employees"
                options={[
                  { value: '1 - 10', label: '1 - 10' },
                  { value: '10 - 100', label: '10 - 100' },
                  { value: '100 - 1,000', label: '100 - 1,000' },
                  { value: '1,000 - 100,000', label: '1,000 - 100,000' },
                  { value: ' > 1,000,000', label: '> 1,000,000' }
                ]}
                clearable={false}
                placeholder="Select an option"
                onChange={props.setFieldValue}
                value={props.values.employees}
                touched={hasSubmited || props.touched.employees}
                error={props.errors.employees}
              />
              <Input
                tag="select"
                label="Your storage needs"
                name="storage"
                options={[
                  { value: '300 TB', label: '300 TB' },
                  { value: '900 TB', label: '300 TB' },
                  { value: '10 PB', label: '10 PB' },
                  { value: '40 EB', label: '40 EB' },
                  { value: '1 ZB', label: '1 ZB' }
                ]}
                clearable={false}
                placeholder="Select an option"
                onChange={props.setFieldValue}
                value={props.values.storage}
                touched={hasSubmited || props.touched.storage}
                error={props.errors.storage}
              />
              <div style={{ fontSize: 14 }}>
                <div className="mb-2">Do you need custom bits?</div>
                <RadioList
                  options={[
                    {
                      id: 'true',
                      text: 'Yes',
                      selected: !!props.values.customBits
                    },
                    {
                      id: 'false',
                      text: 'No',
                      selected: !props.values.customBits
                    }
                  ]}
                  onSelectionChange={selectedIndex => () =>
                    props.setFieldValue('customBits', selectedIndex === 0)}
                />
              </div>
              <div style={{ fontSize: 14 }}>
                <div className="mb-2">Will you Integrate with your AWS S3 Storage?</div>
                <RadioList
                  options={[
                    {
                      id: 'true',
                      text: 'Yes',
                      selected: !!props.values.integration
                    },
                    {
                      id: 'false',
                      text: 'No',
                      selected: !props.values.integration
                    }
                  ]}
                  onSelectionChange={selectedIndex => () =>
                    props.setFieldValue('integration', selectedIndex === 0)}
                />
              </div>
            </div>

            <ButtonRow>
              <Button
                type="button"
                className="btn btn-icon-inactive"
                onClick={prevStep}
                disabled={submiting}
              >
                Go back
              </Button>
              <Button type="submit" className="btn btn-success" disabled={submiting}>
                {submiting ? 'Submiting...' : 'Send'}
              </Button>
            </ButtonRow>
          </Form>
        )}
      />
    );
  }
}
export default enhance(Step2);
