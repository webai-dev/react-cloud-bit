import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export default class TableAvatar extends Component {
  render() {
    const { image, name } = this.props;

    return (
      <AvatarWrapper className="avatar-wrapper">
        {image ? (
          <img alt="img" className="avatar medium bordered" src={image} />
        ) : (
          <Placeholder className="d-flex align-items-center justify-content-center">
            {name[0]}
          </Placeholder>
        )}
      </AvatarWrapper>
    );
  }
}

const AvatarWrapper = styled('div')`
  border: 1px solid ${variables.thumbGray};
  border-radius: 5px;
`;

const Placeholder = styled('div')`
  font-size: ${variables.size24};
  font-weight: 300;

  width: ${variables.size48};
  height: ${variables.size48};

  text-transform: uppercase;

  color: ${variables.primary};
`;
