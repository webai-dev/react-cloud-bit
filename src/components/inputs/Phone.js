import React, { PureComponent } from 'react';
import { FormGroup, Label, Col } from 'reactstrap';
import styled from 'react-emotion';
import { ReactTelephoneInput } from 'react-telephone-input';

import flags from 'assets/img/flags.png';
import variables from 'assets/sass/partials/_exports.scss';

import Error from './Error';

class Phone extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { avatarPath: '' };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(phone) {
    if (this.props.onChange) {
      this.props.onChange(this.props.name, phone);
    }
  }

  render() {
    const { label, id, touched, error, disabled, name, breakpoints } = this.props;

    return (
      <FormGroup className={'form-group-wrapper'} row>
        {label && (
          <Label className="mb-0" for={id} sm={12}>
            <LabelText touched={touched} error={error} disabled={disabled}>
              {label}
            </LabelText>
          </Label>
        )}
        <Col sm={breakpoints && breakpoints.sm ? breakpoints.sm : 12}>
          <Input
            defaultCountry="us"
            flagsImagePath={flags}
            onChange={this.handleInputChange}
            disabled={disabled}
            touched={touched}
            error={error}
            autoFormat={false}
            inputProps={{ name: name }}
          />
          <Error touched={touched} error={error} />
        </Col>
      </FormGroup>
    );
  }
}

export default Phone;

const Input = styled(ReactTelephoneInput)`
  input {
    ${props =>
      props.error && props.touched ? 'border-color: ' + variables.red + ' !important' : ''};
  }
  .flag-dropdown {
    ${props => (props.error && props.touched ? 'border-color: transparent' : '')};
  }
`;

const LabelText = styled('span')`
  color: ${props =>
    props.error && props.touched
      ? variables.red
      : props.disabled
        ? variables.disabled
        : variables.head};
`;
