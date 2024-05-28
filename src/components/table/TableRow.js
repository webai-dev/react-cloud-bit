import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export default class TableRow extends Component {
  render() {
    const { children, className } = this.props;

    return (
      <Row
        className={`d-flex ${className && className !== undefined ? className : ''}`}
        onClick={this.props.onClick ? this.props.onClick : () => {}}
      >
        {children}
      </Row>
    );
  }
}

const Row = styled('div')`
  border-bottom: 1px solid ${variables.linesGray};
  align-items: center;
  padding: ${variables.size8};
`;
