import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

import Header from 'components/layouts/header';

import FilesIndex from 'views/files/FilesIndex';
import BitsIndex from 'views/bits/BitsIndex';
import FoldersIndex from 'views/folders/FoldersIndex';

import { EmptyShared } from 'components/general/EmptyPage';

import { fetchShares, setLoadingStatus } from './_actions';
import { fetchFolderFilters } from 'state/filters/_actions';

class SharesIndex extends Component {
  fetchData = async (team_id, withLoading = true) => {
    if (withLoading) this.props.setLoadingStatus(true);

    let params = {
      team_id: team_id
    };

    const promises = [
      this.props.fetchFolderFilters({ folder_id: null, is_shares: true, team_id }),
      this.props.fetchShares({ shareable_type: 'file', ...params }),
      this.props.fetchShares({ ...params }),
      this.props.fetchShares({ shareable_type: 'bit', ...params })
    ];

    await Promise.all(promises);

    this.props.setLoadingStatus(false);
  };

  isEmpty() {
    const { files, folders, bits } = this.props;

    return (
      (files &&
        folders &&
        bits &&
        (files.length === 0 && folders.length === 0 && bits.length === 0)) ||
      this.props.loading
    );
  }

  componentDidMount() {
    this.fetchData(this.props.active_team.id);
    document.title = 'Shared | yBit';
  }

  componentDidUpdate(prevProps) {
    if (this.props.notifications.length > prevProps.notifications.length) {
      this.fetchData(this.props.active_team.id, false);
    }
  }

  componentWillUnmount() {
    this.props.setLoadingStatus(true);
    document.title = 'yBit';
  }

  render() {
    const { active_team, files, bits, folders } = this.props;

    return (
      <div className="content-inner-wrapper">
        <Header title={'Shared with me'} />
        {this.isEmpty() && <EmptyShared loading={this.props.loading} />}

        {!this.props.loading && (
          <div className="row">
            <div className="col-12">
              {active_team.id && bits && bits.length > 0 && (
                <BitsIndex bits={bits} inShares={true} />
              )}

              {folders && folders.length > 0 && (
                <FoldersIndex history={this.props.history} folders={folders} inShares={true} />
              )}

              {active_team.id && (files && files.length > 0) && (
                <FilesIndex files={files} inShares={true} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    active_team: state.teams.active,
    files: state.shares.files,
    bits: state.shares.bits,
    folders: state.shares.folders,
    loading: state.shares.loading,
    notifications: state.notifications.team.list
  };
}

export default connect(
  mapStateToProps,
  {
    fetchShares,
    setLoadingStatus,
    fetchFolderFilters
  }
)(SharesIndex);
