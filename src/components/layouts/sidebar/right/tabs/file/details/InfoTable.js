import React, { Component } from 'react';
import { format } from 'utils/dates';
import { connect } from 'react-redux';
import { fileType, fileSize } from 'utils/files';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import SvgRender from 'components/general/SvgRender';
import sharedFolder from 'assets/svg/general/shared-folder.svg';

class InfoTable extends Component {
  state = { owner: null, folder: null };

  getTypeString() {
    const { mode, type } = this.props;
    if (mode === 'file') {
      let type = fileType(this.props.mime_type, this.props.extension).type;
      type = type.charAt(0).toUpperCase() + type.slice(1);
      return this.props.extension ? `${type} (${this.props.extension.toUpperCase()})` : type;
    } else if (mode === 'bit') {
      return type.name;
    } else {
      return 'Folder';
    }
  }

  render() {
    const { mode } = this.props;
    return (
      <Container>
        <Title>{mode === 'bit' ? 'Bit' : 'File'} Info</Title>
        <Row>
          <Category>Type</Category>
          {this.getTypeString()}
        </Row>
        {mode === 'file' && (
          <Row>
            <Category>Size</Category>
            {fileSize(this.props.size)}
          </Row>
        )}

        <Row>
          <Category>Location</Category>
          {this.props.folder && (
            <div className="d-flex">
              <SvgRender
                className={`${this.props.folder.type === 'shared' ? 'folder-shared' : ''}`}
                wrapperClassName="mr-1"
                style={{ height: 16, width: 16 }}
                path={sharedFolder}
              />
              {this.props.folder.name}
            </div>
          )}
        </Row>
        <Row>
          <Category>Owner</Category>
          {this.props.owner}
        </Row>
        <Row>
          <Category>Created</Category>
          {format(this.props.created_at)}
        </Row>
      </Container>
    );
  }
}
export default connect((state, props) => {
  let owner = '-';
  let folder = null;

  if (props.user_id === state.user.id) {
    owner = 'me';
  } else {
    const user = state.teammates.list.find(user => user.id === props.user_id);
    if (user) owner = user.name;
  }

  if (props.folder_id === null) {
    folder = { type: 'shared', name: 'Shared with me' };
  } else {
    const usersFolder = state.folders.list.find(folder => folder.id === props.folder_id);

    if (usersFolder)
      folder = { type: usersFolder.is_shared ? 'shared' : 'folder', name: usersFolder.title };
    else {
      const sharedFolder = state.shares
        ? state.shares.folders.find(folder => folder.id === props.folder_id)
        : null;
      if (sharedFolder) folder = { type: 'shared', name: sharedFolder.title };
    }
  }
  return { owner, folder };
})(InfoTable);

const Title = styled('div')`
  margin-top: ${variables.size16};
  margin-bottom: ${variables.size8};
`;

const Category = styled('div')`
  color: ${variables.secondary};
  width: ${variables.size80};
`;

const Container = styled('div')`
  margin-top: ${variables.size40};
`;

const Row = styled('div')`
  display: flex;
  font-size: ${variables.size14};
  margin-bottom: ${variables.size8};
`;
