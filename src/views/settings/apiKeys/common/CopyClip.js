import React, { Component } from 'react';
import SvgRender from 'components/general/SvgRender';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

class AccessKeyCell extends Component {
  state = { show: false };

  toggle = () => this.setState(prev => ({ show: !prev.show }));

  onClick = () => {
    // copy to clipboard
    const el = document.createElement('textarea');
    el.value = this.props.text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // show message
    if (this.state.show) return;
    this.toggle();
    setTimeout(this.toggle, 1000);
  };

  render() {
    const { children, message, text, width, iconOnly } = this.props;
    const { show } = this.state;
    console.log(iconOnly);
    return (
      <Container width={width} onClick={this.onClick}>
        {!iconOnly && <div className="key">{children ? children : text}</div>}
        <div className="copy-action">
          <SvgRender
            style={{ height: 18, cursor: 'pointer' }}
            path={require('assets/svg/actions/copy.svg')}
            wrapperClassName={`copy-icon ${iconOnly ? 'always-show' : ''}`}
          />
          <div className={`message ${show ? 'show' : 'hide'}`}>{message}</div>
        </div>
      </Container>
    );
  }
}
export default AccessKeyCell;

const Container = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;

  .key {
    margin-right: ${variables.size16};
  }

  .copy-action {
    position: relative;
  }

  &:hover .copy-icon {
    visibility: visible;
    opacity: 1;
  }

  .copy-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    &.always-show {
      visibility: visible;
      opacity: 1;
    }
  }

  .message {
    width: ${props => props.width}px;
    height: ${variables.size40};
    position: absolute;
    top: ${variables.size24};
    left: 50%;
    top: ${variables.size16};
    transform: translateX(-50%);
    z-index: 1000;

    visibility: visible;
    opacity: 1;
    transition: 0.2s ease-in-out all;
    &.hide {
      visibility: hidden;
      opacity: 0;
      transition: none;
    }

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 3px;
    border: 1px solid ${variables.linesGray};
    background: white;
  }
`;
