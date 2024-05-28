import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export default class TableCell extends Component {
  render() {
    const { small, children, grow, className } = this.props;

    return (
      <Cell
        small={small}
        grow={grow}
        className={`${className && className !== undefined ? className : ''}`}
      >
        {children}
      </Cell>
    );
  }
}

const Cell = styled('div')`
  position: relative;
  width: 100%;
  min-width: ${variables.size80};

  min-height: 1px;
  padding-right: ${variables.size16};
  padding-left: ${variables.size16};

  flex-basis: 0;
  flex-grow: ${props => (props.small ? '0' : props.grow ? props.grow : '1')};

  font-size: ${variables.size14};
  word-wrap: break-word;

  a,
  .btn-link {
    color: ${variables.head};

    &:hover {
      color: ${variables.main};
    }
  }
`;
