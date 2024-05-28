import React, { Component } from 'react';

import { connect } from 'react-redux';
import { getFolderFullPath } from 'views/folders/_helpers';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

class Breadcrumbs extends Component {
  render() {
    return (
      <Container>
        {this.props.path.map((crumb, i) => (
          <Breadcrumb key={`${crumb}-${i}`}>
            {crumb == '...' ? (
              <div className="dots">
                <span />
                <span />
                <span />
              </div>
            ) : (
              crumb
            )}
          </Breadcrumb>
        ))}
      </Container>
    );
  }
}
export default connect((state, props) => {
  const folder = state.folders.list.find(f => f.id === props.folderId);
  let path = getFolderFullPath(folder, state).map(c => c.title);
  if (path.length >= 2) path = ['...', path[path.length - 1]];
  return {
    path: folder ? ['yBit', ...path, folder.title] : []
  };
})(Breadcrumbs);

const Container = styled('div')`
  display: flex;
  align-items: center;
  font-size: ${variables.size14};

  margin-top: ${variables.size16};
  margin-bottom: ${variables.size32};
`;

const Breadcrumb = styled('div')`
  color: ${variables.secondary};
  display: flex;
  align-items: center;

  &:after {
    content: '';
    display: inline-block;
    margin: 0 ${variables.size4};
    width: ${variables.size14};
    height: ${variables.size14};
    background: url(${require('assets/svg/general/arrow.svg')});
    transform: rotate(-90deg);
  }
  &:last-child {
    color: ${variables.head};
    &:after {
      display: none;
    }
  }

  .dots {
    display: flex;
    span {
      height: 3px;
      width: 3px;
      margin-right: 2px;
      border-radius: 50%;
      background: ${variables.secondary};
    }
  }
`;
