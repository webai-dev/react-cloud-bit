import React, { PureComponent } from 'react';
import styled, { css } from 'react-emotion';
import { FormGroup, Label, Col, Button } from 'reactstrap';
import variables from 'assets/sass/partials/_exports.scss';

import SvgRender from 'components/general/SvgRender';
import Error from './Error';

import view from 'assets/svg/actions/show.svg';
import hide from 'assets/svg/actions/hide.svg';

class Text extends PureComponent {
  state = {
    isPassword: false,
    showPassword: false
  };

  togglePassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.type == 'password') {
      return {
        isPassword: true
      };
    }
  };

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
      breakpoints,
      labelSize,
      labelPosition,
      large,
      ...rest
    } = this.props;

    const modifierClass = classNameWrapper ? classNameWrapper : '';

    const { isPassword, showPassword } = this.state;

    return (
      <FormGroup
        className={`form-group-wrapper ${modifierClass} ${labelSize === 'small' && LabelSmallText}`}
        row
      >
        {label && (
          <Label className="mb-0" for={id} sm={labelPosition === 'side' ? 3 : 12}>
            <LabelText touched={touched} error={error} disabled={disabled}>
              {label}
            </LabelText>
          </Label>
        )}
        <Col
          sm={breakpoints && breakpoints.sm ? breakpoints.sm : labelPosition === 'side' ? 9 : 12}
        >
          <Input
            id={id}
            className={`form-control ${isPassword ? 'password' : ' '} ${large === true &&
              'form-control-lg'}`}
            type={isPassword && showPassword ? 'text' : type}
            placeholder={placeholder ? placeholder : ''}
            onChange={onChange}
            disabled={disabled}
            touched={touched}
            error={error}
            {...rest}
          />
          {isPassword && (
            <ButtonWrap>
              <Button color="link" onClick={() => this.togglePassword()}>
                <SvgRender style={{ height: 16 }} path={isPassword && showPassword ? hide : view} />
              </Button>
            </ButtonWrap>
          )}
          <Error touched={touched} error={error} />
        </Col>
      </FormGroup>
    );
  }
}

export default Text;

const Input = styled('input')`
  &.password {
    padding-right: ${variables.size48};
  }

  ${props => (props.error && props.touched ? 'border: 1px solid ' + variables.red : '')};
`;

const LabelText = styled('span')`
  color: ${props =>
    props.error && props.touched
      ? variables.red
      : props.disabled
      ? variables.disabled
      : variables.head};
`;

const LabelSmallText = css`
  font-size: ${variables.size14};
`;

const ButtonWrap = styled('div')`
  position: absolute;
  right: ${variables.size32};
  top: ${variables.size8};
  height: ${variables.size16};

  > .btn {
    padding: 0px;
    height: ${variables.size16};
    display: inherit;
  }
`;
