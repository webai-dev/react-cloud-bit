import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { css } from 'react-emotion';

import SvgRender from 'components/general/SvgRender';
import Header from 'components/layouts/header';
import ButtonIcon from 'components/general/ButtonIcon';

import Input from 'components/inputs';

import { validateFields } from 'utils/validator';

import { fetchTeamMembers, inviteTeamMember } from './_actions';
import { menu } from 'views/settings/_helpers';
import { isEmail } from 'utils/validator';

import deleteSvg from 'assets/svg/actions/delete.svg';

class TeammatesInvitationsWizard extends Component {
  constructor(props) {
    super(props);

    this.state = { recipients: [], loaded: false, submitting: false };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputRemove = this.handleInputRemove.bind(this);
    this.handleDisabledSubmit = this.handleDisabledSubmit.bind(this);
  }

  handleNewAddition() {
    const recipient = {
      value: '',
      groupId: this.state.recipients.length + 1,
      disabled: false,
      active: true,
      touched: false,
      error: null
    };

    const contact_fields = [
      {
        ...recipient,
        name: 'email',
        type: 'text',
        label: 'Email',
        props: { placeholder: 'Enter email address' }
      },
      {
        ...recipient,
        name: 'phone',
        type: 'phone',
        label: 'Mobile',
        props: { placeholder: 'Enter mobile number' }
      },
      {
        ...recipient,
        name: 'role_id',
        type: 'select',
        label: 'Role',
        props: {
          clearable: false
        }
      }
    ];

    this.setState({
      recipients: [...this.state.recipients, contact_fields]
    });
  }

  handleInputChange(name, value, group) {
    let recipients = [];
    let updatedField = { value: value, active: true, error: null, touched: true };

    if (name === 'role_id') {
      recipients = this.state.recipients.map(rec => {
        if (rec[2].groupId === group && rec[2].name === name) {
          rec[2] = { ...rec[2], ...updatedField };
        }

        return rec;
      });
    } else {
      const isActive = !!value && value !== '+';
      const disabledField = {
        value: '',
        disabled: isActive,
        active: false,
        error: null
      };

      if (name === 'email') {
        updatedField.error = value !== '' && !isEmail(value) ? 'Invalid email address' : null;
      }

      recipients = this.state.recipients.map(rec => {
        if (rec[0].groupId === group && rec[0].name === name) {
          rec[0] = { ...rec[0], ...updatedField };
          rec[1] = { ...rec[1], ...disabledField };
        } else if (rec[1].groupId === group && rec[1].name === name) {
          rec[1] = { ...rec[1], ...updatedField };
          rec[0] = { ...rec[0], ...disabledField };
        }

        return rec;
      });
    }

    this.setState({ recipients });
  }

  handleInputRemove(field) {
    const recipients = this.state.recipients.filter(x => x !== field);

    this.setState({ recipients });
  }

  handleDisabledSubmit() {
    const disabled =
      this.state.submitting ||
      this.state.recipients.length === 0 ||
      this.state.recipients.some(
        rec =>
          rec.some(field => field.error !== null) ||
          (rec[0].value === '' &&
            (rec[1].value === '' || (rec[1].value !== '' && rec[1].value.length < 5)))
      );

    return disabled;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitting: true });

    const contacts = this.state.recipients
      .filter(contact => {
        return contact[0].active || contact[1].active;
      })
      .map(contact => {
        const c = contact.find(x => x.active);
        return {
          ...c,
          role_id: contact[2].value === '' ? this.props.roles[0].id : contact[2].value
        };
      });

    let contactsWithErrors = validateFields(contacts);

    if (contactsWithErrors) {
      let participants = this.state.recipients.map(recipient => {
        const existsWithErrors = contactsWithErrors.find(
          recipientWithError => recipientWithError.id === recipient.id
        );
        return existsWithErrors ? existsWithErrors : recipient;
      });

      this.setState({ participants });
    } else {
      const invitations = contacts.map(x => {
        return { contact: x.value, role_id: x.role_id };
      });

      const team_id = this.props.active_team.id;
      const params = { invitations, team_id };

      this.props.inviteTeamMember(params).then(data => {
        if (data) this.props.history.goBack();

        this.setState({ submitting: false });
      });
    }
  }

  componentDidMount() {
    this.handleNewAddition();

    if (this.props.teammates.length === 0)
      this.props.fetchTeamMembers({ team_id: this.props.active_team.id }).then(data => {
        if (data) this.setState({ loaded: true });
      });
    else this.setState({ loaded: true });

    document.title = 'Team invitations | yBit';
  }
  componentWillUnmount() {
    document.title = 'yBit';
  }

  render() {
    const recipients = this.state.recipients;
    const { active_team, user, roles } = this.props;

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

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-empty btn-arrow-back-icon btn-arrow-back-primary btn-smaller d-inline-flex align-items-center p-0"
            onClick={() => this.props.history.goBack()}
          >
            Back
          </button>
        </div>

        {this.state.loaded && (
          <Fragment>
            {roles.length > 0 &&
            active_team.user_id &&
            user.id &&
            user.role &&
            (active_team.user_id === user.id || user.role.label === 'admin') ? (
              <Row>
                <Col>
                  <div className="mb-4">
                    <strong className="d-block">Send invitations</strong>

                    <small className="secondary-text">
                      Invite a teamate to join the {active_team.name} team
                    </small>
                  </div>

                  <form onSubmit={this.handleSubmit.bind(this)}>
                    {recipients.map((fields, fieldIndex) => (
                      <Row className="mb-2" key={`field-${fieldIndex}`}>
                        <Col xs="8" className={`${multifieldFromStyle}`}>
                          <Row>
                            {fields.map((contact, contactIndex) => (
                              <Col
                                xs={contact.name === 'role_id' ? 2 : ''}
                                key={`contact-${contactIndex}`}
                                className="multifield"
                              >
                                <Input
                                  tag={contact.type}
                                  value={
                                    contact.name === 'role_id' && contact.value === ''
                                      ? roles[0] && roles[0].id
                                        ? roles[0].id
                                        : null
                                      : contact.value
                                  }
                                  label={contact.label}
                                  name={contact.name}
                                  disabled={contact.disabled}
                                  touched={contact.touched}
                                  error={contact.error}
                                  options={
                                    contact.name === 'role_id'
                                      ? this.props.roles.map(r => {
                                          return { value: r.id, label: r.name };
                                        })
                                      : []
                                  }
                                  onChange={
                                    contact.name === 'phone' || contact.name === 'role_id'
                                      ? (name, value) =>
                                          this.handleInputChange(name, value, contact.groupId)
                                      : e =>
                                          this.handleInputChange(
                                            e.target.name,
                                            e.target.value,
                                            contact.groupId
                                          )
                                  }
                                  {...contact.props}
                                />
                              </Col>
                            ))}
                          </Row>
                        </Col>
                        <Col xs="4" className="d-flex align-items-center mt-1">
                          {fieldIndex === recipients.length - 1 && (
                            <button
                              type="button"
                              className="btn btn-success btn-smaller d-flex align-items-center px-2"
                              onClick={() => this.handleNewAddition()}
                            >
                              <ButtonIcon
                                icon="create-thin"
                                iconClassName="create-plus-svg"
                                width={12}
                                height={12}
                              >
                                {recipients.length === 1 ? (
                                  <span className="pl-1">Add new recipients</span>
                                ) : null}
                              </ButtonIcon>
                            </button>
                          )}

                          {recipients.length > 1 ? (
                            <button
                              onClick={() => this.handleInputRemove(fields)}
                              type="button"
                              className="btn btn-empty px-2"
                            >
                              <SvgRender style={{ height: 16 }} path={deleteSvg} />
                            </button>
                          ) : null}
                        </Col>
                      </Row>
                    ))}

                    <Row>
                      <Col xs="8" className="text-right">
                        <button
                          type="button"
                          className="btn btn-remove-link mt-2"
                          onClick={() => this.props.history.goBack()}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success mt-2 pr-4 pl-4 ml-4"
                          disabled={this.handleDisabledSubmit()}
                        >
                          Send Invitations
                        </button>
                      </Col>
                    </Row>
                  </form>
                </Col>
              </Row>
            ) : (
              <div>You don't have permissions to add new members to this team.</div>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    teammates: state.teammates.list,
    roles: state.roles,
    user: state.user
  };
}

export default connect(
  mapStateToProps,
  { fetchTeamMembers, inviteTeamMember }
)(TeammatesInvitationsWizard);

const multifieldFromStyle = css``;
