import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';

import sort from 'utils/sort';

import SimpleModal from 'components/modals/SimpleModal';
import CollapseItems from 'components/general/CollapseItems';
import DeletePreventation from 'components/modals/DeletePrevention';
import MoveTreeModal from 'components/modals/MoveTreeModal';
import SharingModal from 'views/shares/SharingModal';

import { BitsBreakpointsClasses } from 'utils/media';

import { MSG } from 'utils/alerts';
import { lockItem } from 'views/dashboard/_actions';
import { fetchBit, deleteBit, selectBit, editBit } from './_actions';
import { deleteShare, selectSharedBit } from 'views/shares/_actions';
import { getSelectedItems } from 'state/bulk/_helpers';
import { filtersExpandCollapse } from 'state/filters/_actions';
import { deleteShortcut } from 'state/shortcuts/_actions';

import Bit from './Bit';

class BitsIndex extends Component {
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
    this.handleShortcutDeleteAction = this.handleShortcutDeleteAction.bind(this);
    this.handleLockAction = this.handleLockAction.bind(this);
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  triggerModalAction(e, type, bit) {
    let modalActions = {};

    modalActions.moveBit = {
      title: `Move ${bit.title} to folder`,
      modal: (
        <MoveTreeModal
          type="move"
          shareable_type="bit"
          item={bit}
          bit={true}
          toggle={this.toggleModal}
          inShares={this.props.inShares}
        />
      )
    };

    modalActions.createShortcutBit = {
      title: `Create shortcut of ${bit.title} in folder`,
      modal: (
        <MoveTreeModal
          type="shortcut"
          shareable_type="bit"
          item={bit}
          bit={true}
          toggle={this.toggleModal}
          inShares={this.props.inShares}
        />
      )
    };

    modalActions.deleteBit = {
      title: bit.is_shortcut
        ? MSG.SHORTCUT_REMOVE_PREVENTION_TITLE(bit.title)
        : this.props.inShares
        ? MSG.SHARE_REMOVE_PREVENTION_TITLE(bit.title)
        : MSG.BIT_DELETE_PREVENTION_TITLE(bit.title),
      modal: (
        <DeletePreventation
          item={bit}
          body={
            bit.is_shortcut
              ? MSG.SHORTCUT_REMOVE_PREVENTION_TEXT('bit')
              : this.props.inShares
              ? MSG.SHARE_REMOVE_PREVENTION_TEXT('bit')
              : MSG.BIT_DELETE_PREVENTION_TEXT
          }
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleDeleteAction}
        />
      )
    };

    modalActions.deleteShortcutBit = {
      title: MSG.SHORTCUT_REMOVE_PREVENTION_TITLE(bit.title),
      modal: (
        <DeletePreventation
          item={bit}
          body={MSG.SHORTCUT_REMOVE_PREVENTION_TEXT('bit')}
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleShortcutDeleteAction}
        />
      )
    };

    modalActions.shareBit = {
      title: `Share ${bit.title}`,
      modal: <SharingModal item={bit} shareable_type="bit" toggle={this.toggleModal} />
    };

    this.setState(
      {
        modalActions: modalActions,
        modalAction: modalActions[type] ? type : ''
      },
      this.toggleModal
    );
  }

  handleDeleteAction(e, item) {
    let params = { team_id: this.props.active_team.id };

    if (item.is_shortcut) {
      params.shortcut_id = item.shortcut_id;
      params.shareable_type = 'bit';
    } else if (this.props.inShares) {
      params.id = item.share.id;
      params.user_id = this.props.user.id;
    } else {
      params.id = item.id;
    }

    (item.is_shortcut
      ? this.props.deleteShortcut(params)
      : this.props.inShares
      ? this.props.deleteShare(params)
      : this.props.deleteBit(params)
    ).then(data => {
      if (data) {
        this.toggleModal();
        this.props.history.push(`/folder/${item.folder_id}`);
      }
    });
  }

  handleShortcutDeleteAction(e, item) {
    let params = { team_id: this.props.active_team.id };

    params.shortcut_id = item.shortcut_id;
    params.shareable_type = 'bit';
    this.props.deleteShortcut(params).then(data => {
      if (data) this.toggleModal();
    });
  }

  handleLockAction(e, bit) {
    this.props.lockItem({ type: 'bits', id: bit.id, team_id: this.props.active_team.id });
  }

  render() {
    const {
      active_team,
      active_folder,
      bits,
      isLastInOrder,
      collapse,
      filtersExpandCollapse,
      fillGaps,
      ignoreSortOrder
    } = this.props;
    return (
      <div className={`row ${isLastInOrder ? '' : 'mb-10'}`}>
        <CollapseItems
          collapse={collapse && !this.props.match.params.bit_id}
          title="Bits"
          count={bits.length}
          expand={() => filtersExpandCollapse('bits')}
        >
          <div className="col-12">
            <div className={`bit-index-wrapper mb-4 ${fillGaps ? 'dense' : ''}`}>
              {(ignoreSortOrder ? bits : sort(bits, this.props.sortBy)).map((bit, index) => {
                return (
                  <Bit
                    key={bit.id}
                    bit={bit}
                    action={this.triggerModalAction}
                    lock={this.handleLockAction}
                    selectBit={
                      this.props.active_folder ? this.props.selectBit : this.props.selectSharedBit
                    }
                    selected={this.props.selected_bits}
                    className={`grid-column-${bit.type.width} grid-row-${
                      bit.type.height
                    } ${BitsBreakpointsClasses(bit.type.width)}`}
                    inShares={this.props.inShares}
                    active_team={active_team}
                    active_folder={active_folder}
                    fetchBit={params => this.props.fetchBit(params)}
                    editBit={params => this.props.editBit(params)}
                    user={this.props.user}
                  />
                );
              })}
            </div>
          </div>

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
        </CollapseItems>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    active_team: state.teams.active,
    active_folder: state.folders.active,
    selected_bits: getSelectedItems(state).selected_bits,
    sortBy: state.filters.sortBy,
    isLastInOrder: state.filters.order.bits === 2,
    collapse: state.filters.collapse.bits,
    fillGaps: state.filters.fillGaps,
    sidebarOpen: state.sidebar.show
  };
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    {
      filtersExpandCollapse,
      fetchBit,
      deleteBit,
      lockItem,
      selectBit,
      editBit,
      selectSharedBit,
      deleteShortcut,
      deleteShare
    }
  )
)(BitsIndex);
