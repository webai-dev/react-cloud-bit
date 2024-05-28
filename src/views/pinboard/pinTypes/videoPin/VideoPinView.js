import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import ReactPlayer from 'react-player';

export class VideoPinView extends Component {
  render() {
    const {
      content: { url, title }
    } = this.props;
    return (
      <VideoPin>
        <ReactPlayer
          url={url}
          config={{
            youtube: { preload: true }
          }}
          width={'100%'}
          height={'320px'}
        />
        {title && <Title>{title}</Title>}
      </VideoPin>
    );
  }
}

export default VideoPinView;

const VideoPin = styled('div')`
  border: 1px solid ${variables.linesGray};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: 0;
`;
const Title = styled('div')`
  font-weight: 500;
  padding: ${variables.size8} ${variables.size16};
`;
