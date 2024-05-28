import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export class TextPinView extends Component {
  render() {
    const {
      content: { content }
    } = this.props;
    return (
      <TextPin>
        <Text dangerouslySetInnerHTML={{ __html: content }} />
      </TextPin>
    );
  }
}

export default TextPinView;

const TextPin = styled('div')`
  border: 1px solid ${variables.linesGray};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: 0
  position: relative;
  padding-top: ${variables.size16};
  padding-bottom: ${variables.size8};
  :before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: ${variables.size24};
    height: 100%;
    width: 1px;
    background: #f0c5d9;
  }
`;

const Text = styled('div')`
  padding-left: ${variables.size32};
  padding-right: ${variables.size16};
  background: linear-gradient(to bottom, white 23px, #d4edf7 1px);
  background-size: 100% 24px;
  height: 100%;
  min-height: 248px;
  > :last-child {
    margin-bottom: 0;
  }
  p {
    line-height: ${variables.size24};
    margin-bottom: ${variables.size24};
    word-wrap: break-word;

    a {
      word-wrap: break-word;
    }
  }
  ul,
  ol {
    margin-bottom: ${variables.size24};
    padding-left: ${variables.size16};
    li {
      line-height: ${variables.size24};
    }
  }
`;
