import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectSharedCount } from 'state/sharedUsers';

import SvgRender from 'components/general/SvgRender';

import bullets from 'assets/svg/general/bullets.svg';
import pp from 'assets/svg/general/shared-pp-simple.svg';

class FolderHeaderActions extends Component {
  render() {
    const {
      active_clicked,
      active_folder,
      triggerModalAction,
      handleFolderClick,
      shares,
      locked
    } = this.props;

    return (
      <div className="d-flex align-items-center">
        {shares.count > 1 ? (
          <button
            type="button"
            className={`btn btn-empty btn-smaller d-flex align-items-center justify-content-center p-0 ${
              !shares.hasIndividualShares ? 'text-secondary' : ''
            }`}
            onClick={e => triggerModalAction(e, 'shareFolder')}
            disabled={locked}
          >
            <SvgRender style={{ height: 14 }} path={pp} />
            <span className="pl-1">{shares.count}</span>
          </button>
        ) : null}
        <button
          type="button"
          id="folder-actions"
          className={`ml-2 btn btn-empty btn-smaller btn-small-border ${
            active_clicked.current.id &&
            active_clicked.current.id == active_folder &&
            active_clicked.current.view === 'index'
              ? 'btn-open'
              : ''
          }`}
          onClick={handleFolderClick}
        >
          <SvgRender style={{ height: 16 }} path={bullets} />
        </button>
      </div>
    );
  }
}

export default connect((state, props) => ({
  shares: selectSharedCount(state, 'folder', props.active_folder),
  locked: state.teams.active.locked
}))(FolderHeaderActions);
