import React, { Component } from 'react';
import { default as ReactSelect } from 'react-select';
import { FormGroup, Label, Col } from 'reactstrap';
import styled from 'react-emotion';

import variables from 'assets/sass/partials/_exports.scss';
import Error from './Error';

export class Select extends Component {
  handleChange = value => {
    if (this.props.onChange) {
      this.props.onChange(this.props.name, value.value);
    }
  };

  render() {
    const {
      onChange,
      onBlur,
      value,
      label,
      id,
      touched,
      error,
      disabled,
      className,
      breakClasses,
      ...rest
    } = this.props;

    return (
      <FormGroup
        className={`form-group-wrapper ${className && className !== undefined ? className : ''}`}
        row
      >
        {label && (
          <Label className="mb-0" for={id} sm={12}>
            <LabelText touched={touched} error={error} disabled={disabled}>
              {label}
            </LabelText>
          </Label>
        )}
        <Col className={breakClasses ? breakClasses : 'col-12'}>
          <Input
            onChange={this.handleChange}
            value={this.props.value}
            touched={touched}
            error={error}
            disabled={disabled ? disabled : false}
            {...rest}
          />
          <Error touched={touched} error={error} />
        </Col>
      </FormGroup>
    );
  }
}

export default Select;

const Input = styled(ReactSelect)`
  .Select-control {
    ${props => (props.error && props.touched ? 'border: 1px solid ' + variables.red : '')};
  }
`;

const LabelText = styled('span')`
  color: ${props => (props.error && props.touched ? variables.red : variables.head)};
`;
