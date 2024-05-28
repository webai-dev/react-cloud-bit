import React, { Component } from 'react';
import SvgRender from 'components/general/SvgRender';
import check from 'assets/svg/general/check.svg';

import { FormGroup } from 'reactstrap';

class Checkbox extends Component {
  renderCheckedBox() {
    return (
      <div className="checkedBox mr-1">
        <SvgRender path={check} style={{ height: 8, fill: 'white' }} />
      </div>
    );
  }

  renderUnCheckedBox() {
    return <div className="uncheckedBox mr-1" />;
  }

  render() {
    return (
      <FormGroup
        className={`checkbox d-flex align-items-center ${
          this.props.className ? this.props.className : ''
        } ${this.props.disabled ? 'disabled' : ''}`}
        onClick={this.props.handleClick}
      >
        {this.props.value ? this.renderCheckedBox() : this.renderUnCheckedBox()}
        <span className="text">{this.props.label}</span>
      </FormGroup>
    );
  }
}

export default Checkbox;
