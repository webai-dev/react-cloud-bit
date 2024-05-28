import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export class PhotoPinView extends Component {
  render() {
    const {
      content: { url, title }
    } = this.props;
    return (
      <PhotoPin>
        <Image src={url} alt="pin" />
        {title && <Title>{title}</Title>}
      </PhotoPin>
    );
  }
}

export default PhotoPinView;

const PhotoPin = styled('div')`
  border: 1px solid ${variables.linesGray};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: 0;
`;
const Image = styled('img')`
  width: 100%;
`;
const Title = styled('div')`
  font-weight: 500;
  padding: ${variables.size8} ${variables.size16};
`;
