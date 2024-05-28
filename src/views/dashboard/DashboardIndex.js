import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from 'components/layouts/header';

import FilesIndex from 'views/files/FilesIndex';
import BitsIndex from 'views/bits/BitsIndex';

import { fetchLockedItems, setLoadingStatus } from './_actions';
import { fetchFolderFilters } from 'state/filters/_actions';

import { EmptyDashboard } from 'components/general/EmptyPage';

class DashboardIndex extends Component {
  fetchData = async team_id => {
    this.props.setLoadingStatus(true);
    const params = {
      team_id: team_id
    };

    const promises = [
      this.props.fetchLockedItems({ type: 'files', ...params }),
      this.props.fetchLockedItems({ type: 'bits', ...params }),
      this.props.fetchFolderFilters(params)
    ];

    await Promise.all(promises);

    this.props.setLoadingStatus(false);
  };

  componentDidMount() {
    this.fetchData(this.props.active_team.id);

    document.title = 'Dashboard | yBit';
  }

  componentWillUnmount() {
    this.props.setLoadingStatus(true);
    document.title = 'yBit';
  }

  isEmpty() {
    const { bits, files } = this.props;

    return (bits && bits.length === 0 && (files && files.length === 0)) || this.props.loading;
  }

  render() {
    const { active_team, files, bits } = this.props;

    return (
      <div className="content-inner-wrapper">
        <Header title={'Dashboard'} />
        {this.isEmpty() && <EmptyDashboard loading={this.props.loading} />}

        {!this.props.loading && (
          <div className="row">
            <div className="col-12">
              {active_team.id && bits && bits.length > 0 && <BitsIndex bits={bits} />}

              {active_team.id && (files && files.length > 0) && <FilesIndex files={files} />}
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    active_team: state.teams.active,
    files: state.dashboard.files,
    bits: state.dashboard.bits,
    loading: state.dashboard.loading
  };
}

export default connect(
  mapStateToProps,
  {
    fetchLockedItems,
    setLoadingStatus,
    fetchFolderFilters
  }
)(DashboardIndex);
