import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { Row, Col, Button } from 'reactstrap';

import Header from 'components/layouts/header';
import Submenu from 'views/settings/users/Submenu';

import { TableAvatar, TableBody, TableCell, TableHeader, TableRow } from 'components/table';

import DeletePrevention from 'components/modals/DeletePrevention';
import SimpleModal from 'components/modals/SimpleModal';
import LeaveTeam from 'components/modals/LeaveTeam';

import Input from 'components/inputs';
import SvgRender from 'components/general/SvgRender';

import deleteSvg from 'assets/svg/actions/delete.svg';

import { fetchTeamMembers, deleteMember, updateMember } from './_actions';
import { menu } from 'views/settings/_helpers';

class TeammatesIndex extends Component {
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

    modalActions.deleteMember = {
      title: `Remove member`,
      modal: (
        <DeletePrevention
          item={item}
          body={`You are about to remove ${
            item ? item.name : ''
          } from this team. Are you sure you want to continue?`}
          buttonLabel="Continue"
          toggle={this.toggleModal}
          action={this.handleDeleteMember.bind(this)}
        />
      )
    };

    modalActions.leaveTeam = {
      title: `Leave team`,
      modal: <LeaveTeam toggle={this.toggleModal} />
    };

    this.setState(
      {
        modalActions: modalActions,
        modalAction: modalActions[type] ? type : ''
      },
      this.toggleModal
    );
  }

  handleDeleteMember(e, item) {
    this.props.deleteMember({ id: this.props.active_team.id, user_id: item.id }).then(data => {
      if (data) this.toggleModal();
    });
  }

  updateMember(user, val, field) {
    const params = {
      team_id: this.props.active_team.id,
      user_id: user.id,
      [field]: val
    };

    this.props.updateMember(params);
  }

  fetchData(team_id) {
    this.props.fetchTeamMembers({ team_id });
  }

  componentDidMount() {
    this.fetchData(this.props.active_team.id);

    document.title = 'Teammates | yBit';
  }
  componentWillUnmount() {
    document.title = 'yBit';
  }

  render() {
    const { teammates, user, active_team } = this.props;

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

        <Row className="align-items-end justify-content-end">
          <Col xs="12">
            <Submenu action={user.role.label === 'owner' || user.role.label === 'admin'} />
          </Col>
        </Row>

        {user && user.id ? (
          <Fragment>
            <TableBody className="table">
              <TableRow className="table-header pb-0">
                <TableHeader className="pb-1" small />
                <TableHeader className="pb-1" title="Name" />
                <TableHeader className="pb-1" title="Email" />
                <TableHeader className="pb-1" title="Telephone" />
                <TableHeader className="pb-1" title="Role" />
                <TableHeader className="pb-1" title="Developer" />
                <TableHeader className="pb-1" title="" small />
              </TableRow>
              {teammates.map((column, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell small>
                      <TableAvatar image={column.photo} name={column.name} />
                    </TableCell>
                    <TableCell>{column.name}</TableCell>
                    <TableCell>{column.email}</TableCell>
                    <TableCell>{column.phone}</TableCell>
                    <TableCell>
                      {column.is_owner ? (
                        'Owner'
                      ) : (
                        <Input
                          tag="select"
                          name="type"
                          placeholder="Choose role"
                          value={column.role_id}
                          onChange={(name, val) => this.updateMember(column, val, 'role_id')}
                          options={this.props.roles.map(r => {
                            return { value: r.id, label: r.name };
                          })}
                          clearable={false}
                          searchable={false}
                          disabled={
                            (user.role &&
                              user.role.label !== 'admin' &&
                              user.role.label !== 'owner') ||
                            user.id === column.id
                          }
                          breakClasses="col-12 col-lap-10 col-hd-7"
                          className="mb-0"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        tag="switch"
                        classNameWrapper="mb-0"
                        checked={column.developer}
                        onChange={e => {
                          this.updateMember(column, e, 'developer');
                        }}
                      />
                    </TableCell>
                    <TableCell className="text-center p-0" small>
                      {active_team &&
                        user.role &&
                        user.id !== column.id &&
                        (active_team.user_id === user.id || user.role.label === 'admin') &&
                        !column.is_owner && (
                          <button
                            type="button"
                            className="btn d-flex align-items-center btn-empty p-0 btn-small-share"
                            onClick={e => this.triggerModalAction(e, 'deleteMember', column)}
                          >
                            <SvgRender style={{ height: 16 }} path={deleteSvg} />
                          </button>
                        )}
                      {active_team && user.id === column.id && (
                        <Button
                          color="remove-link"
                          onClick={e => this.triggerModalAction(e, 'leaveTeam')}
                        >
                          Leave Team
                        </Button>
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
          </Fragment>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    user: state.user,
    teammates: state.teammates.list,
    roles: state.roles
  };
}

export default connect(
  mapStateToProps,
  {
    fetchTeamMembers,
    deleteMember,
    updateMember
  }
)(TeammatesIndex);
