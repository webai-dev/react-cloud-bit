import React, { Component } from 'react';

import { humanizePercentage } from 'utils/functions';
import { fileSize } from 'utils/files';

import { connect } from 'react-redux';
import { fetchStorage } from '../../store/_actions';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import { Info, Text, SecondaryText } from './common';
import ProgressRing from './ProgressRing';

const enhance = connect(
  state => ({ ...state.marketplace.storage }),
  { fetchStorage }
);
class Storage extends Component {
  componentDidMount() {
    this.props.fetchStorage();
  }

  render() {
    const { used, total } = this.props;
    const percentage = !isNaN(used) && !isNaN(total) && total > 0 ? used / total : 0;
    return (
      <div>
        <ProgressRing percentage={percentage} />
        <Row>
          <Info>
            <Text>{fileSize(used)}</Text>
            <SecondaryText>{humanizePercentage(percentage)}% used</SecondaryText>
          </Info>
          <Info>
            {total == null ? <Text>Unlimited</Text> : <Text>{fileSize(total)}</Text>}
            <SecondaryText>Total Storage</SecondaryText>
          </Info>
        </Row>
      </div>
    );
  }
}
export default enhance(Storage);

const Row = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${variables.size16};
  > div {
    padding: 0 ${variables.size24};
    border-right: 1px solid ${variables.disabled};
    &:last-child {
      border-right: none;
    }
  }
`;
