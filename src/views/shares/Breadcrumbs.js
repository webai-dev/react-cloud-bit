import React, { Component } from 'react';

import { connect } from 'react-redux';
import { getFolderFullPath } from 'views/folders/_helpers';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

class Breadcrumbs extends Component {
  render() {
    return (
      <Container>
        {this.props.path.length > 0 && <small className="mr-1"> on : </small>}
        {this.props.path.map((crumb, i) => (
          <Breadcrumb key={`${crumb}-${i}`}>
            <a href={crumb.link}>{crumb.title}</a>
          </Breadcrumb>
        ))}
      </Container>
    );
  }
}
export default connect((state, props) => {
  const folder = state.folders.list.find(f => f.id === props.folderId);

  let path = getFolderFullPath(folder, state).map(c => ({
    title: c.title,
    link: `/folder/${c.id}`
  }));
  if (path.length >= 3)
    path = [{ title: '...', link: null }, path[path.length - 2], path[path.length - 1]];
  return {
    path: folder ? [...path, { title: folder.title, link: `/folder/${folder.id}` }] : []
  };
})(Breadcrumbs);

const Container = styled('div')`
  display: inline-flex;
  align-items: center;
  font-size: ${variables.size12};
`;

const Breadcrumb = styled('div')`
  color: ${variables.secondary};
  &:after {
    content: '';
    display: inline-block;
    margin: 0 4px;
    width: ${variables.size12};
    height: ${variables.size12};
    background: url(${require('assets/svg/general/arrow.svg')});
    transform: rotate(-90deg);
  }
  &:last-child {
    color: ${variables.head};
    &:after {
      display: none;
    }
  }
  a {
    color: inherit;
    &:hover {
      color: ${variables.primary};
    }
  }
`;
