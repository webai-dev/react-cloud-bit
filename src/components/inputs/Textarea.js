import React, { PureComponent } from 'react';
import { FormGroup, Label, Col } from 'reactstrap';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import Error from './Error';

class Textarea extends PureComponent {
  render() {
    const {
      label,
      id,
      placeholder,
      type,
      touched,
      error,
      onChange,
      classNameWrapper,
      disabled,
      inputWidth,
      ...rest
    } = this.props;

    const modifierClass = classNameWrapper ? classNameWrapper : '';

    return (
      <FormGroup className={'form-group-wrapper ' + modifierClass} row>
        {label && (
          <Label className="mb-0" for={id} sm={12}>
            <LabelText touched={touched} error={error} disabled={disabled}>
              {label}
            </LabelText>
          </Label>
        )}
        <Col sm={inputWidth ? inputWidth : 12}>
          <Input
            id={id}
            className={`form-control`}
            type={type}
            placeholder={placeholder ? placeholder : ''}
            onChange={onChange}
            disabled={disabled}
            touched={touched}
            error={error}
            {...rest}
          />
          <Error touched={touched} error={error} />
        </Col>
      </FormGroup>
    );
  }
}

export default Textarea;

const Input = styled('textarea')`
  ${props => (props.error && props.touched ? 'border: 1px solid ' + variables.red : '')};
  min-height: 80px;
`;

const LabelText = styled('span')`
  color: ${props =>
    props.error && props.touched
      ? variables.red
      : props.disabled
        ? variables.disabled
        : variables.head};
`;
