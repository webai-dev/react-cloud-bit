import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchFileActivity } from 'views/files/_actions';
import { fetchBitActivity } from 'views/bits/_actions';
import { fetchFolderActivity } from 'views/folders/_actions';
import ActivityAction from './ActivityAction';
import styled from 'react-emotion';
import { debounce } from 'lodash';

const actions = [
  'rename',
  'move',
  'edit',
  'share_add',
  'share_edit',
  'upload',
  'reupload',
  'create',
  'copy',
  'change',
  'download',
  'open'
];
class Versions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.mode === 'file') {
      this.props.fetchFileActivity({ id: this.props.id });
    } else if (this.props.mode === 'folder') {
      this.props.fetchFolderActivity({ id: this.props.id });
    } else {
      this.props.fetchBitActivity({ id: this.props.id });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.mode === 'file') {
      if (this.props.id !== prevProps.id) this.props.fetchFileActivity({ id: this.props.id });
    } else if (this.props.mode === 'folder') {
      if (this.props.id !== prevProps.id) this.props.fetchFolderActivity({ id: this.props.id });
    } else {
      if (this.props.id !== prevProps.id) this.props.fetchBitActivity({ id: this.props.id });
    }
  }

  render() {
    const { activity, mode } = this.props;
    return (
      <ActivityWrapper id="activity-container" className="pb-3" onScroll={this.onScroll}>
        {activity.map(({ action, user, created_at, changes, metadata }, i) => (
          <ActivityContainer key={i.toString()} className={`${i === 0 ? 'pt-2' : ''}`}>
            {actions.includes(action) ? (
              <ActivityAction
                mode={mode}
                action={action}
                user={user}
                created={created_at}
                metadata={metadata}
                changes={changes}
              />
            ) : (
              ''
            )}
          </ActivityContainer>
        ))}
      </ActivityWrapper>
    );
  }
}

export default connect(
  (state, props) => {
    let activity;
    if (props.mode === 'file') {
      activity = state.files.activity.data;
    } else if (props.mode === 'bit') {
      activity = state.bits.activity.data;
    } else {
      activity = state.folders.activity.data;
    }
    return {
      activity: activity ? activity : [],
      state
    };
  },
  { fetchFileActivity, fetchBitActivity, fetchFolderActivity }
)(Versions);

const ActivityWrapper = styled('div')`
  position: relative;

  ::before {
    content: '';
    width: 1px;
    display: flex;
    background-color: #e0e6ed;
    position: absolute;
    left: 17px;
    z-index: 1;
    flex-grow: 1;
    height: 100%;
    bottom: 17px;
    top: -35px;
  }
`;

const ActivityContainer = styled('div')`
  padding: 0;
`;
