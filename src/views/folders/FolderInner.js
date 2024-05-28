import BackToFolder from 'components/general/BackToFolder';
import { EmptyFolder, EmptySearch } from 'components/general/EmptyPage';
import Header from 'components/layouts/header';
import SimpleModal from 'components/modals/SimpleModal';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { fetchFolderFilters } from 'state/filters/_actions';
import { fetchTeamSearch } from 'state/search/_actions';
import { parseQueryParams } from 'utils/query';
import BitsIndex from 'views/bits/BitsIndex';
import { fetchBit, fetchFolderBits } from 'views/bits/_actions';
import FilesIndex from 'views/files/FilesIndex';
import { fetchFile, fetchFolderFiles } from 'views/files/_actions';
import SharingModal from 'views/shares/SharingModal';
import { fetchShare } from 'views/shares/_actions';
import FolderHeaderActions from './FolderHeaderActions';
import FoldersIndex from './FoldersIndex';
import { clearSelected, fetchFolders, setClickActiveFolder, setLoadingStatus } from './_actions';
import SelectedActions from 'components/general/SelectedActions';

class FolderInner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      modalAction: '',
      modalActions: {},
      hasSearch: false,
      render: false
    };

    this.triggerModalAction = this.triggerModalAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleFolderClick = this.handleFolderClick.bind(this);
  }

  _mounted = false;

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  triggerModalAction(e, type, folder) {
    let modalActions = {};

    modalActions.shareFolder = {
      title: `Share ${this.props.parent.title}`,
      modal: (
        <SharingModal item={this.props.parent} shareable_type="folder" toggle={this.toggleModal} />
      )
    };

    this.setState(
      {
        modalActions: modalActions,
        modalAction: modalActions[type] ? type : ''
      },
      this.toggleModal
    );
  }

  handleFolderClick(e) {
    const el = document.getElementById('folder-actions');
    const rect = el.getBoundingClientRect();

    this.props.setClickActiveFolder({
      current: { ...this.props.parent, view: 'index' },
      last: { ...this.props.parent, view: 'index' },
      position: { left: rect.right - 32 + 'px', top: rect.top + 40 + 'px' }
    });
  }

  fetchFolderData = async ({ folder_id }) => {
    this.props.setLoadingStatus(true);
    const params = {
      team_id: this.props.active_team.id,
      folder_id
    };

    const promises = [
      this.props.fetchFolderFilters(params),
      this.props.fetchFolders(params),
      this.props.fetchFolderFiles(params),
      this.props.fetchFolderBits(params)
    ];

    await Promise.all(promises);

    this.props.clearSelected();
    this.props.setLoadingStatus(false);

    const folder = this.props.folders_list.find(folder => folder.id === this.props.active_folder);
    if (folder) document.title = folder.title + ' | yBit';
  };

  fetchQueryData = async search => {
    this.props.setLoadingStatus(true);
    const queryParams = parseQueryParams(search);

    let params = {
      team_id: this.props.active_team.id,
      search: queryParams.terms,
      owner: queryParams.owner ? parseInt(queryParams.owner) : null,
      shareable_type: queryParams.types,
      tags: queryParams.tags,
      type: 'index'
    };

    await this.props.fetchTeamSearch(params);

    this.props.clearSelected();
    this.props.setLoadingStatus(false);
    if (this._mounted !== false) this.setState({ hasSearch: true });

    document.title = 'Search results | yBit';
  };

  fetchComponentData = async ({ id, type }) => {
    if (id !== undefined) {
      this.props.setLoadingStatus(true);
      const params = {
        team_id: this.props.active_team.id,
        view: 'simple',
        [type + '_id']: id
      };

      if (type === 'bit') {
        const bit = await this.props.fetchBit(params);
        if (bit) document.title = bit.title + ' | yBit';
      } else if (type === 'file') {
        const file = await this.props.fetchFile(params);
        if (file) document.title = file.title + ' | yBit';
      }
      this.props.clearSelected();
      this.props.setLoadingStatus(false);
    }
  };

  renderItemsWithOrder(items, order) {
    if (this.props.order.bits === order) {
      return (
        items.bits &&
        items.bits.length > 0 && (
          <BitsIndex
            bits={items.bits}
            match={this.props.match}
            ignoreSortOrder={this.state.hasSearch}
          />
        )
      );
    } else if (this.props.order.folders === order) {
      return (
        items.folders &&
        items.folders.length > 0 && (
          <FoldersIndex
            history={this.props.history}
            folders={items.folders}
            match={this.props.match}
            ignoreSortOrder={this.state.hasSearch}
          />
        )
      );
    } else {
      return (
        items.files &&
        items.files.length > 0 && (
          <FilesIndex
            history={this.props.history}
            files={items.files}
            match={this.props.match}
            ignoreSortOrder={this.state.hasSearch}
          />
        )
      );
    }
  }

  componentWillReceiveProps(nextProps, oldProps) {
    const { id: next_id, file_id: next_file_id, bit_id: next_bit_id } = nextProps.match.params;
    const { id: old_id, file_id: old_file_id, bit_id: old_bit_id } = this.props.match.params;

    const next_search = nextProps.location.search;
    const old_search = this.props.location.search;

    if (next_id && old_id !== next_id) {
      this.fetchFolderData({ folder_id: next_id });
    } else if (next_file_id && old_file_id !== next_file_id) {
      this.fetchComponentData({ id: next_file_id, type: 'file' });
    } else if (next_bit_id && old_bit_id !== next_bit_id) {
      this.fetchComponentData({ id: next_bit_id, type: 'bit' });
    } else if (next_search && old_search !== next_search) {
      this.fetchQueryData(next_search);
    }

    if (
      nextProps.location &&
      this.props.location &&
      this.props.location.pathname !== nextProps.location.pathname
    ) {
      this.setState({ render: false });
    }
  }

  componentDidMount() {
    this._mounted = true;
    const { id, file_id, bit_id } = this.props.match.params;
    const search = this.props.location.search;

    if (id) this.fetchFolderData({ folder_id: id });
    else if (bit_id) this.fetchComponentData({ id: bit_id, type: 'bit' });
    else if (file_id) this.fetchComponentData({ id: file_id, type: 'file' });
    else if (search) this.fetchQueryData(search);
  }

  componentWillUnmount() {
    this._mounted = false;
    document.title = 'yBit';
  }

  render() {
    const {
      parent,
      active_team,
      active_folder,
      active_clicked,
      folders_list,
      search_results,
      loading
    } = this.props;
    const { file_id, bit_id } = this.props.match.params;
    const folders = this.state.hasSearch
      ? search_results.folders
      : active_folder
      ? folders_list.filter(f => f.folder_id === active_folder)
      : [];
    const files = this.state.hasSearch ? search_results.files : !bit_id ? this.props.files : [];
    const bits = this.state.hasSearch ? search_results.bits : !file_id ? this.props.bits : [];

    return (
      <div className="content-inner-wrapper">
        <Header
          breadcrumbs={true}
          header_actions={
            !this.state.hasSearch && this.props.user.role.label !== 'guest' && active_folder ? (
              <FolderHeaderActions
                parent={parent}
                active_clicked={active_clicked}
                active_folder={active_folder}
                triggerModalAction={this.triggerModalAction}
                handleFolderClick={this.handleFolderClick}
                modalOpen={this.state.modalOpen}
              />
            ) : null
          }
        />

        {(folders.length > 0 || files.length > 0) &&
        !loading &&
        !this.state.hasSearch &&
        !file_id &&
        !bit_id ? (
          <Row>
            <Col xs={'auto'} className="mb-3">
              <SelectedActions
                totalCount={folders.length + files.length + bits.length}
                inShares={this.props.location.pathname === '/shared'}
              />
            </Col>
          </Row>
        ) : null}

        {((folders.length === 0 && files.length === 0 && bits.length === 0) || loading) &&
          (this.state.hasSearch ? (
            <EmptySearch loading={this.props.loading} />
          ) : (
            <EmptyFolder loading={this.props.loading} />
          ))}

        {!loading &&
          active_team.id &&
          (active_folder || this.state.hasSearch || bit_id || file_id) && (
            <Row>
              <Col xs="12">
                <BackToFolder match={this.props.match} bits={bits} files={files} folder={folders} />
              </Col>

              <Col className="d-flex flex-column">
                {this.renderItemsWithOrder({ bits, folders, files }, 0)}
                {this.renderItemsWithOrder({ bits, folders, files }, 1)}
                {this.renderItemsWithOrder({ bits, folders, files }, 2)}
              </Col>
            </Row>
          )}

        <SimpleModal
          header={
            this.state.modalActions[this.state.modalAction]
              ? this.state.modalActions[this.state.modalAction].title
              : ''
          }
          body={
            this.state.modalActions[this.state.modalAction]
              ? this.state.modalActions[this.state.modalAction].modal
              : ''
          }
          modalOpen={this.state.modalOpen}
          toggle={this.toggleModal}
        />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    active_team: state.teams.active,
    active_folder: state.folders.active,
    active_clicked: state.folders.click_active,
    folders_list: state.folders.list,
    parent: state.folders.list.find(f => f.id === state.folders.active) || {},
    files: state.files.list,
    bits: state.bits.list,
    search_results: state.search.index,
    order: state.filters.order,
    loading: state.folders.loading
  };
}

export default connect(
  mapStateToProps,
  {
    fetchFolderFiles,
    setClickActiveFolder,
    fetchShare,
    fetchFolderBits,
    fetchFolders,
    clearSelected,
    setLoadingStatus,
    fetchTeamSearch,
    fetchBit,
    fetchFile,
    fetchFolderFilters
  }
)(FolderInner);
