import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'react-emotion';
import { withRouter } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import Header from 'components/layouts/header';
import variables from 'assets/sass/partials/_exports.scss';
import { format } from 'utils/dates';
import SvgRender from 'components/general/SvgRender';

import {
  getPins,
  loadMorePins,
  favouritePin,
  deletePin,
  toggleFavorites,
  setLoadingStatus
} from './_actions';
import { pinViews } from './_helpers';

import SimpleModal from 'components/modals/SimpleModal';
import DeletePreventation from 'components/modals/DeletePrevention';
import ButtonIcon from 'components/general/ButtonIcon';

import { EmptyFlaggedPins, EmptyPinboard } from '../../components/general/EmptyPage';

import flagged from 'assets/svg/pinboard/flagged.svg';
import bullets from 'assets/svg/general/bullets.svg';

const NUMBER_OF_COLUMNS = 4;

class PinboardIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      modalAction: '',
      modalActions: {}
    };

    this.triggerModalAction = this.triggerModalAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleDeleteAction = this.handleDeleteAction.bind(this);
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  triggerModalAction(e, type, pin) {
    let modalActions = {};

    modalActions.deletePin = {
      title: `Delete pin`,
      modal: (
        <DeletePreventation
          item={pin}
          body={`You are about to delete this pin. Are you sure you want to continue?`}
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleDeleteAction}
        />
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

  handleDeleteAction(e, pin) {
    this.props.deletePin({ team_id: this.props.teamId, id: pin.id }).then(data => {
      if (data) this.toggleModal();
    });
  }

  markFavourite = pinId => {
    this.props.favouritePin({ id: pinId });
  };

  loadMore = () => {
    this.props.loadMorePins({ team_id: this.props.teamId });
  };

  fetchPins = async favourites => {
    this.props.setLoadingStatus(true);
    const params = { team_id: this.props.teamId, favourites };

    await this.props.getPins(params);
    this.props.setLoadingStatus(false);
  };

  componentDidMount = () => {
    if (this.props.teamId) {
      this.fetchPins(0);
    }

    document.title = 'Pinboard | yBit';
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.showFavorites !== this.props.showFavorites) {
      this.fetchPins(this.props.showFavorites ? 1 : 0);
    }
  }

  componentWillUnmount() {
    document.title = 'yBit';
  }

  render() {
    const { pins, pinLength, pagination, favourite_count } = this.props;

    return (
      <div className="content-inner-wrapper">
        <Header title="Pinboard" isPinboard />

        {(pinLength === 0 || this.props.loading) &&
          (this.props.showFavorites ? (
            <EmptyFlaggedPins loading={this.props.loading} />
          ) : (
            <EmptyPinboard loading={this.props.loading} />
          ))}

        <div className="d-flex mb-3">
          <button
            type="button"
            className={`btn btn-flagged btn-smaller ${this.props.showFavorites ? 'active' : ''}`}
            onClick={() => {
              this.props.toggleFavorites();
            }}
          >
            <SvgRender className="flagged-svg" path={flagged} style={{ height: 16 }} />
            <span className="flagged-num">{favourite_count}</span>
          </button>
        </div>

        {!this.props.loading && (
          <div className="row">
            {pins.map((pinCol, index) => (
              <div className="col-12 col-lg-6 col-xl-3" key={index}>
                {pinCol.map((pin, index) => (
                  <Pin className="mb-4" key={index}>
                    {pinViews[pin.content_type](pin)}
                    <PinFooter>
                      <div className="d-flex align-items-center">
                        <div>
                          <Editor>{pin.user.name}</Editor>
                          <Date>{`on ${format(pin.updated_at)}`}</Date>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-empty p-0 ml-auto mr-2 ${
                            pin.favourite ? 'active' : ''
                          }`}
                          onClick={() => this.markFavourite(pin.id)}
                        >
                          <SvgRender
                            path={flagged}
                            className="favourite-icon"
                            style={{ height: 16, cursor: 'pointer' }}
                          />
                        </button>

                        {this.props.user.role.label !== 'guest' && (
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className={`btn-dropdown btn-empty btn-small-share btn-small-border`}
                            >
                              <SvgRender style={{ height: 16 }} path={bullets} />
                            </DropdownToggle>
                            <DropdownMenu right className={DropdownMenuStyle}>
                              <DropdownItem
                                className="btn dropdown-item btn-dropdown-icon btn-edit-icon"
                                onClick={e => this.props.history.push(`/pin/${pin.id}`)}
                              >
                                <ButtonIcon icon="edit">Edit</ButtonIcon>
                              </DropdownItem>
                              <DropdownItem
                                className="btn dropdown-item btn-dropdown-icon btn-delete-icon"
                                onClick={e => this.triggerModalAction(e, 'deletePin', pin)}
                              >
                                <ButtonIcon icon="delete">Delete</ButtonIcon>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        )}
                      </div>
                    </PinFooter>
                  </Pin>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="d-flex justify-content-center">
          {pagination.currentPage < pagination.lastPage && (
            <button type="button" className="btn btn-primary" onClick={this.loadMore}>
              Load More
            </button>
          )}
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  let formattedPins = [[], [], [], []];
  state.pinboard.pins.map((pin, key) => formattedPins[key % NUMBER_OF_COLUMNS].push(pin));

  return {
    teamName: state.teams.active.name,
    teamId: state.teams.active.id,
    pins: formattedPins,
    pinLength: state.pinboard.pins.length,
    loading: state.pinboard.loading,
    pagination: {
      currentPage: state.pinboard.currentPage,
      lastPage: state.pinboard.lastPage
    },
    favourite_count: state.pinboard.favourite_count,
    showFavorites: state.pinboard.showFavorites,
    user: state.user
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getPins,
      loadMorePins,
      favouritePin,
      deletePin,
      toggleFavorites,
      setLoadingStatus
    }
  )(PinboardIndex)
);

const Pin = styled('div')`
  transition: all 0.3s ease;
  background: #fff;
`;

const PinFooter = styled('div')`
  border: 1px solid ${variables.linesGray};
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  padding: 12px 24px;
  font-size: ${variables.size14};
`;

const Editor = styled('div')`
  font-weight: 500;
  margin-bottom: 4px;
`;

const Date = styled('div')`
  font-size: ${variables.size12};
`;

const DropdownMenuStyle = css`
  top: -32px !important;
  left: -40px !important;
`;
