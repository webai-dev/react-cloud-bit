import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import SvgRender from 'components/general/SvgRender';
import styled from 'react-emotion';
import {
  Dropdown,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import SimpleModal from 'components/modals/SimpleModal';
import DeletePreventation from 'components/modals/DeletePrevention';
import MoveTreeModal from 'components/modals/MoveTreeModal';
import SharingModal from 'views/shares/SharingModal';
import ButtonIcon from 'components/general/ButtonIcon';

import { MSG } from 'utils/alerts';

import { clearSelected, selectFolder } from 'views/folders/_actions';
import { selectSharedFolder, selectSharedFile, selectSharedBit } from 'views/shares/_actions';
import { selectFile } from 'views/files/_actions';
import { selectBit } from 'views/bits/_actions';

import { removeFromShared } from 'views/shares/_actions';
import { bulkDownload, bulkDelete } from 'state/bulk/_actions';
import { getSelectedItems, setSelectedItemsParams } from 'state/bulk/_helpers';

import variables from 'assets/sass/partials/_exports.scss';
//import bullets from 'assets/svg/general/bullets.svg';

export class SelectedActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      modalAction: '',
      modalActions: {},
      dropdownOpen: false
    };

    this.triggerModalAction = this.triggerModalAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleDeleteAction = this.handleDeleteAction.bind(this);
  }

  _bulkMethods = [
    'selectFolder',
    'selectSharedFolder',
    'selectSharedFile',
    'selectSharedBit',
    'selectFile',
    'selectBit'
  ];

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  handleDeleteAction() {
    let params = setSelectedItemsParams({
      bits: this.props.selected_bits,
      files: this.props.selected_files,
      folders: this.props.selected_folders
    });

    params.team_id = this.props.active_team.id;

    if (this.props.inShares) {
      delete params.bits;
      delete params.files;
      delete params.folders;
      delete params.shortcuts;
    }

    (this.props.inShares
      ? this.props.removeFromShared(params)
      : this.props.bulkDelete(params)
    ).then(data => {
      if (data) {
        this.setState({
          modalOpen: false
        });
      }
    });
  }

  triggerModalAction(e, type) {
    let modalActions = {};

    modalActions.move = {
      title: `Move selected items to folder`,
      modal: <MoveTreeModal type="move" bulk={true} toggle={this.toggleModal} />
    };

    modalActions.delete = {
      title: this.props.inShares
        ? MSG.BULK_SHARE_REMOVE_PREVENTION_TITLE
        : MSG.BULK_DELETE_PREVENTION_TITLE,
      modal: (
        <DeletePreventation
          body={
            this.props.inShares
              ? MSG.BULK_SHARE_REMOVE_PREVENTION_TEXT
              : MSG.BULK_DELETE_PREVENTION_TEXT
          }
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleDeleteAction}
          bulk={true}
        />
      )
    };

    modalActions.share = {
      title: `Share selected items`,
      modal: <SharingModal bulk={true} toggle={this.toggleModal} />
    };

    this.setState(
      {
        modalActions: modalActions,
        modalAction: modalActions[type] ? type : ''
      },
      this.toggleModal
    );
  }

  triggerDownloadAction() {
    let params = {
      files: [...this.props.selected_files],
      folders: [...this.props.selected_folders]
    };

    this.props.bulkDownload(params).then(data => {
      if (data) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';

        const blob = new Blob([data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `ybit-download-${new Date().getTime()}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      }
    });
  }

  selectionContains(type) {
    switch (type) {
      case 'file':
        return this.props.selected_files.length > 0;
      case 'folder':
        return this.props.selected_folders.length > 0;
      case 'bit':
        return this.props.selected_bits.length > 0;
      default:
        return true;
    }
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  handleClickOutside = e => {
    if (!this.dropConatiner.contains(e.target)) {
      this.setState({ dropdownOpen: false });
    }
  };

  handleAction = type => {
    this.setState({ dropdownOpen: false });
    this.props.clearSelected();

    if (type == 'none') {
      return;
    }

    if (type == 'all') {
      const isShared = this.props.active_folder;

      this._bulkMethods
        .filter(m => {
          return isShared ? m.indexOf('Shared') == -1 : m.indexOf('Shared') >= 0;
        })
        .forEach(m => {
          this.props[m]({ multiple: true });
        });

      return;
    }

    this.props[type]({ multiple: true });
  };

  toggleAction = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  render() {
    const { selected_folders, selected_files, selected_bits, locked, totalCount } = this.props;
    const total = selected_folders.length + selected_files.length + selected_bits.length;
    const isShared = this.props.active_folder;

    return (
      <SelectedActionsWrap className={`d-flex align-items-center justify-content-end pr-1`}>
        <Fragment>
          <Inner>
            <div ref={el => (this.dropConatiner = el)}>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={() => {}}>
                <DropdownToggle
                  className="select-section d-flex align-items-center justify-content-between"
                  tag={'div'}
                >
                  <button
                    type="button"
                    className={`btn btn-clear-selected d-flex align-items-center justify-content-center p-0 ${
                      total == 0 ? '' : total < totalCount ? 'semi-active' : 'active'
                    }`}
                    onClick={() => this.handleAction(total == 0 ? 'all' : 'none')}
                  />
                  <span className="dropdown-toggle btn" onClick={this.toggleAction} />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem className="btn" onClick={() => this.handleAction('all')}>
                    All
                  </DropdownItem>
                  <DropdownItem className="btn" onClick={() => this.handleAction('none')}>
                    None
                  </DropdownItem>
                  <DropdownItem
                    className="btn"
                    onClick={() => this.handleAction(isShared ? 'selectFile' : 'selectSharedFile')}
                  >
                    Files
                  </DropdownItem>
                  <DropdownItem
                    className="btn"
                    onClick={() =>
                      this.handleAction(isShared ? 'selectFolder' : 'selectSharedFolder')
                    }
                  >
                    Folders
                  </DropdownItem>
                  <DropdownItem
                    className="btn"
                    onClick={() => this.handleAction(isShared ? 'selectBit' : 'selectSharedBit')}
                  >
                    Bits
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </Inner>

          {total > 0 && (
            <Fragment>
              <Inner className="ml-1">
                <UncontrolledDropdown>
                  <DropdownToggle className={`btn-dropdown btn-actions px-1 font-weight-semibold`}>
                    Bulk Actions
                  </DropdownToggle>
                  <DropdownMenu>
                    {!this.selectionContains('bit') && (
                      <DropdownItem
                        className="btn dropdown-item btn-dropdown-icon btn-download-icon"
                        onClick={e => this.triggerDownloadAction(e)}
                        disabled={locked}
                      >
                        <ButtonIcon icon="download">Download</ButtonIcon>
                      </DropdownItem>
                    )}

                    {this.props.user.role.label !== 'guest' && (
                      <Fragment>
                        {this.props.inShares !== true ? (
                          <DropdownItem
                            className="btn dropdown-item btn-dropdown-icon btn-move-icon"
                            onClick={e => this.triggerModalAction(e, 'move')}
                            disabled={locked}
                          >
                            <ButtonIcon icon="move">Move</ButtonIcon>
                          </DropdownItem>
                        ) : null}
                        <DropdownItem
                          className="btn dropdown-item btn-dropdown-icon btn-share-icon"
                          onClick={e => this.triggerModalAction(e, 'share')}
                          disabled={locked}
                        >
                          <ButtonIcon icon="share">Share</ButtonIcon>
                        </DropdownItem>
                        <DropdownItem
                          className="btn dropdown-item btn-dropdown-icon btn-delete-icon"
                          onClick={e => this.triggerModalAction(e, 'delete')}
                        >
                          <ButtonIcon icon="delete">
                            {this.props.inShares ? 'Remove from Shared' : 'Delete'}
                          </ButtonIcon>
                        </DropdownItem>
                      </Fragment>
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Inner>
              <Inner>
                for the <strong>{total}</strong> {total === 1 ? 'item' : 'items'} selected
              </Inner>
            </Fragment>
          )}
        </Fragment>

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
      </SelectedActionsWrap>
    );
  }
}

function mapStateToProps(state) {
  const selected = getSelectedItems(state);

  return {
    user: state.user,
    active_team: state.teams.active,
    selected_bits: selected.selected_bits,
    selected_files: selected.selected_files,
    selected_folders: selected.selected_folders,
    selected_shortcuts: selected.selected_shortcuts,
    locked: state.teams.active.locked,
    active_folder: state.folders.active
  };
}

export default connect(
  mapStateToProps,
  {
    clearSelected,
    removeFromShared,
    bulkDownload,
    bulkDelete,
    selectFolder,
    selectSharedFolder,
    selectSharedFile,
    selectFile,
    selectBit,
    selectSharedBit
  }
)(SelectedActions);

const SelectedActionsWrap = styled('div')`
  .btn-clear-selected {
    width: ${variables.size16};
    height: ${variables.size16};
    border: 1px solid ${variables.sharedFolder};
    border-radius: 0;
    background: none;
    font-size: ${variables.size14};
  }
`;

const Inner = styled('div')`
  font-size: ${variables.size14};
  line-height: ${variables.size14};
  .btn-small-border {
    transform: rotate(90deg);
  }
  .dropdown-menu {
    width: ${variables.size136};
    .dropdown-item:last-child {
      border: none;
    }
  }

  .btn-actions {
    color: ${variables.blue};
    padding: 0;
    height: auto;
    &:hover {
      color: ${variables.main};
    }
    &:active {
      color: ${variables.main} !important;
    }
  }

  .select-section {
    background-color: rgba(133, 183, 217, 0.2);
    padding: ${variables.size8};
    width: ${variables.size48};
    border-radius: 3px;
    .dropdown-toggle {
      height: ${variables.size16};
      padding: 2px 0 0 0;
      color: ${variables.head};
    }
  }
`;
