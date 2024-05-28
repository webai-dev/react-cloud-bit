import React, { PureComponent } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

class Error extends PureComponent {
  render() {
    const { touched, error } = this.props;
    return (
      <InputWrapper className="error-wrapper">
        {touched && error && error !== '' ? <ErrorWrap>{error}</ErrorWrap> : null}
        {this.props.children}
      </InputWrapper>
    );
  }
}

export default Error;

const InputWrapper = styled('div')`
  position: relative;
`;
const ErrorWrap = styled('div')`
  font-size: ${variables.size12};
  color: ${variables.red};

  &:first-letter {
    text-transform: uppercase;
  }
`;
