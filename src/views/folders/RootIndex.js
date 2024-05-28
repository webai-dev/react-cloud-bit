import React, { Component } from 'react';
import { connect } from 'react-redux';
import orderBy from 'lodash/orderBy';

import Header from 'components/layouts/header';
import FoldersIndex from 'views/folders/FoldersIndex';

import { fetchFolderFilters } from 'state/filters/_actions';

import { EmptyRoot } from 'components/general/EmptyPage';

class RootIndex extends Component {
  isEmpty() {
    const { root_folders } = this.props;
    return root_folders && root_folders.length === 0;
  }

  render() {
    const { root_folders } = this.props;
    return (
      <div className="content-inner-wrapper">
        <Header breadcrumbs={true} />
        {this.isEmpty() && <EmptyRoot loading={false} />}

        <div className="row">
          <div className="col-12">
            {root_folders && root_folders.length > 0 && (
              <FoldersIndex history={this.props.history} folders={root_folders} root={true} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    root_folders: orderBy(
      state.folders.list.filter(f => f.root),
      [s => s.title.toLowerCase()],
      ['asc']
    ),
    active_team: state.teams.active
  };
}

export default connect(
  mapStateToProps,
  { fetchFolderFilters }
)(RootIndex);
