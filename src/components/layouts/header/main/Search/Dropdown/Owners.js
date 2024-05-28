import React, { Component, Fragment } from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import OwnerCard from '../OwnerCard';

class Owners extends Component {
  state = { limit: 9 };

  showMore = () => this.setState(prev => ({ limit: prev.limit * 2 }));

  render() {
    const { teammates, loading, onAdd, onRemove, selected } = this.props;
    const { limit } = this.state;

    return (
      <Fragment>
        <Wrapper>
          {loading ? (
            <Loading>Loading ... </Loading>
          ) : (
            teammates &&
            teammates.slice(0, limit).map(mate => {
              const isSelected = selected === mate.id;
              return (
                <OwnerCard
                  key={mate.id}
                  {...mate}
                  selected={isSelected}
                  onClick={() =>
                    isSelected ? onRemove(mate.id, mate.name) : onAdd(mate.id, mate.name)
                  }
                />
              );
            })
          )}
        </Wrapper>
        {teammates && teammates.length > limit && (
          <ShowMore onClick={this.showMore}>More...</ShowMore>
        )}
      </Fragment>
    );
  }
}
export default Owners;

const Wrapper = styled('div')`
  display: flex;
  flex-wrap: wrap;
  min-height: 120px;
  max-height: 500px;
  overflow: overlay;
`;

const ShowMore = styled('div')`
  color: ${variables.primary};
  font-size: ${variables.size12};
  text-align: right;

  cursor: pointer;
`;

const Loading = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${variables.textSec};
`;
