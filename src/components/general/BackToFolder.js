import React, { Component } from 'react';
import styled from 'react-emotion';
import { NavLink } from 'react-router-dom';

import variables from 'assets/sass/partials/_exports.scss';

export class BackToFolder extends Component {
  render() {
    const { match, bits, files } = this.props;
    const search = window.location.search.slice(1);
    const matches = search.split('=');
    const item = match.params.bit_id
      ? bits.find(b => b.id == match.params.bit_id)
      : match.params.file_id
        ? files.find(b => b.id == match.params.file_id)
        : null;

    return (
      <BackWrapper>
        {matches && matches[0] === 'folder' && matches[1] ? (
          <div className="back-wrapper">
            <NavLink exact to={`/folder/${matches[1]}`}>
              Back to folder
            </NavLink>
          </div>
        ) : item && item !== undefined ? (
          <div className="back-wrapper">
            <NavLink exact to={item.folder_id ? `/folder/${item.folder_id}` : '/shared'}>
              {item.folder_id ? 'Back to folder' : 'Back to shared with me'}
            </NavLink>
          </div>
        ) : null}
      </BackWrapper>
    );
  }
}

export default BackToFolder;

const BackWrapper = styled('div')`
  .back-wrapper {
    margin-bottom: ${variables.size40};

    a {
      color: ${variables.secondary};

      &:hover {
        color: ${variables.head};
      }

      &:before {
        content: '';
        display: inline-block;
        height: 10px;
        width: 10px;
        border-style: solid;
        border-color: inherit;
        border-width: 0px 1px 1px 0px;
        transform: rotate(135deg);
        margin-right: ${variables.size8};
      }
    }
  }
`;
