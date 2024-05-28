import React, { Component } from 'react';
import { connect } from 'react-redux';
import { orderBy } from 'lodash';

import Header from 'components/layouts/header';
import Submenu from 'views/settings/users/Submenu';

import SvgRender from 'components/general/SvgRender';
import SimpleModal from 'components/modals/SimpleModal';
import DeletePrevention from 'components/modals/DeletePrevention';

import deleteSvg from 'assets/svg/actions/delete.svg';

import { format } from 'utils/dates';
import { TableBody, TableCell, TableHeader, TableRow } from 'components/table';
import { isEmail } from 'utils/validator';
import { fetchTeamInvitedMembers } from 'views/teammates/_actions';
import { deleteInvitation } from 'views/invitations/_actions';
import { menu } from 'views/settings/_helpers';

class TeammatesInvitations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      modalAction: '',
      modalActions: {}
    };

    this.triggerModalAction = this.triggerModalAction.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  triggerModalAction(e, type, item) {
    let modalActions = {};

    modalActions.deleteInvitation = {
      title: `Delete invitation`,
      modal: (
        <DeletePrevention
          item={item}
          body={`You are about to delete the invitation for ${
            item.contact
          }. Are you sure you want to continue?`}
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleDeleteInvitation.bind(this)}
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

  handleDeleteInvitation(e, item) {
    this.props.deleteInvitation({ id: item.id }).then(data => {
      if (data) this.toggleModal();
    });
  }

  fetchData(team_id) {
    this.props.fetchTeamInvitedMembers({ team_id });
  }

  componentDidMount() {
    this.fetchData(this.props.active_team.id);

    document.title = ' Team invitations | yBit';
  }
  componentWillUnmount() {
    document.title = ' yBit';
  }

  render() {
    const { invited_members, user, active_team } = this.props;

    return (
      <div className="content-inner-wrapper">
        <Header
          title={'Settings'}
          menu={
            user.role.label === 'owner' || user.role.label === 'admin'
              ? menu
              : menu.filter(m => m.label !== 'team')
          }
        />

        <Submenu action={user.role.label === 'owner' || user.role.label === 'admin'} />

        <TableBody className="table">
          <TableRow className="table-header p-0">
            <TableHeader className="p-0 pb-1" grow="2" title="Email" />
            <TableHeader className="p-0 pb-1" title="Telephone" />
            <TableHeader className="p-0 pb-1" title="Invited by" />
            <TableHeader className="p-0 pb-1" title="Invited at" />
            <TableHeader className="p-0 pb-1" title="Role" />
            <TableHeader className="justify-content-center p-0 pb-1" title="Status" />
            <TableHeader title="" small />
          </TableRow>

          {invited_members.map((column, index) => {
            return (
              <TableRow key={index} className="p-0">
                <TableCell className="p-0 py-2" grow="2">
                  {isEmail(column.contact) ? column.contact : ''}
                </TableCell>
                <TableCell className="p-0 py-2">
                  {!isEmail(column.contact) ? column.contact : ''}
                </TableCell>
                <TableCell className="p-0 py-2">{column.user ? column.user.name : ''}</TableCell>
                <TableCell className="p-0 py-2">{format(column.created_at)}</TableCell>
                <TableCell className="p-0 py-2">
                  {column.role && column.role.name ? column.role.name : ''}
                </TableCell>
                <TableCell className="text-center p-0 py-2">{column.status}</TableCell>
                <TableCell className="text-center p-0 py-2" small>
                  {column.user &&
                    user.role &&
                    (column.user.id === user.id ||
                      (active_team.user_id === user.id || user.role.label === 'admin')) &&
                    column.status !== 'accepted' && (
                      <button
                        type="button"
                        className="btn d-flex align-items-center btn-empty p-0 btn-small-share"
                        onClick={e => this.triggerModalAction(e, 'deleteInvitation', column)}
                      >
                        <SvgRender style={{ height: 16 }} path={deleteSvg} />
                      </button>
                    )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

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
  return {
    user: state.user,
    active_team: state.teams.active,
    invited_members: orderBy(state.teammates.invited, ['status', 'created_at'], ['desc', 'desc'])
  };
}

export default connect(
  mapStateToProps,
  {
    fetchTeamInvitedMembers,
    deleteInvitation
  }
)(TeammatesInvitations);
