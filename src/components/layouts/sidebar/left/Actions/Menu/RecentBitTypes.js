import React, { Component } from 'react';
import { apiService } from 'utils/api';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

class RecentBitTypes extends Component {
  state = { loading: false, types: [] };

  componentDidMount() {
    apiService.get('bits/types/recent').then(res => this.setState({ types: res.data }));
  }

  render() {
    return (
      <div style={{ height: 160 }}>
        <Title className="pl-3 mb-1">Types created recently</Title>
        {this.state.types.map(type => (
          <Container key={type.id} onClick={() => this.props.onSelect(type.id)}>
            <IconContainer>
              <Icon url={type.icon} />
            </IconContainer>
            <Name>{type.name}</Name>
          </Container>
        ))}
      </div>
    );
  }
}
export default RecentBitTypes;

const Title = styled('div')`
  font-weight: 600;
  color: #8492a6;
  font-size: 10px;
`;

const Container = styled('div')`
  display: flex;
  aling-items: center;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 24px;
  cursor: pointer;

  &:hover {
    color: ${variables.primary};
    background-color: ${variables.bgGray};
  }
`;

const IconContainer = styled('div')`
  padding: 4px;
  height: 26px;
  width: 26px;

  border: 1px solid #e6f0f7;
  border-radius: 3px;
  background-color: #ffff;
  margin-right: ${variables.size12};
`;
const Icon = styled('div')`
  width: 100%;
  height: 100%;

  ${({ url }) =>
    url &&
    `
  background: url(${url}) no-repeat center;
  background-size: contain;
  `};
`;

const Name = styled('div')`
  display: flex;
  align-items: center;
  font-size: 14px;
`;
