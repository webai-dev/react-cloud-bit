import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export default class TableHeader extends Component {
  handleSortChange(direction) {}

  render() {
    const { direction, small, title, sortable, sorted, grow, className } = this.props;

    return (
      <Cell
        className={`d-flex ${className && className !== undefined ? className : ''}`}
        small={small}
        grow={grow}
      >
        <Title>{title}</Title>
        {sortable && (
          <div className="ml-4 d-flex flex-column justify-content-center">
            <Arrow
              onClick={() => this.handleSortChange('asc')}
              sorted={sorted}
              direction={direction}
            />
          </div>
        )}
      </Cell>
    );
  }
}

const Title = styled('div')`
  font-size: ${variables.size12};
  text-transform: uppercase;
`;

const Cell = styled('div')`
  position: relative;
  width: 100%;
  min-width: ${variables.size80};
  min-height: 1px;
  padding-right: ${variables.size16};
  padding-left: ${variables.size16};

  max-width: 100%;
  flex-basis: 0;
  flex-grow: ${props => (props.small ? '0' : props.grow ? props.grow : '1')};

  padding-bottom: ${variables.size16};
  color: ${variables.secondary};
`;

const Arrow = styled('div')`
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid ${variables.head};
  cursor: pointer;

  border-bottom-color: ${props => (props.sorted ? variables.green : variables.head)}
  transform: ${props => (props.direction === 'desc' ? 'rotate(180deg)' : 'none')}
`;
