import React, { Component } from 'react';

export default class TableBody extends Component {
  render() {
    const { children } = this.props;

    return <div>{children}</div>;
  }
}
