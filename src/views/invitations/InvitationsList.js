import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import { updateTeamInvitation, fetchInvitations } from './_actions';
import { fetchTeams } from 'views/teams/_actions';

class InvitationsList extends React.Component {
  state = {
    isUpdating: false
  };

  updateInvitation(invitation_id, accepted) {
    this.props.updateTeamInvitation({ invitation_id, accepted }).then(() => {
      this.setState({ isUpdating: false });
      this.props.fetchTeams();
    });
  }

  componentDidMount() {
    if (this.props.invitations.length === 0) this.props.fetchInvitations();
  }

  render() {
    const invitations = this.props.invitations;

    return (
      <div className="content-inner-wrapper">
        {invitations.length > 0 ? (
          this.props.accountView !== true && (
            <div>
              <b className="d-block">You have been invited into:</b>
              <small className="secondary-text">You can accept or deny invitations</small>
            </div>
          )
        ) : (
          <div>
            <p className="d-block">You have no invitations at the moment.</p>
          </div>
        )}
        <div className="mb-8">
          <Row>
            {invitations.map(invitation => {
              return (
                <Col xs="12" key={invitation.id}>
                  <TeamContainer className="d-flex align-items-center">
                    <TeamImageWrapper>
                      <TeamImage
                        style={{
                          backgroundImage: `url(${invitation.team.photo})`,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover'
                        }}
                      />
                    </TeamImageWrapper>
                    <TeamName className="text-truncate">{invitation.team.name}</TeamName>
                    <div className="d-flex align-items-center">
                      <button
                        type="button"
                        className={`btn btn btn-remove-link`}
                        disabled={this.state.isUpdating}
                        onClick={() => {
                          this.setState({ isUpdating: true });
                          this.updateInvitation(invitation.id, false);
                        }}
                      >
                        Deny
                      </button>
                      <button
                        type="button"
                        className={`btn btn-green ml-2 px-4`}
                        disabled={this.state.isUpdating}
                        onClick={() => {
                          this.setState({ isUpdating: true });
                          this.updateInvitation(invitation.id, true);
                        }}
                      >
                        <strong>Accept</strong>
                      </button>
                    </div>
                  </TeamContainer>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { invitations: state.invitations.list };
}

export default connect(
  mapStateToProps,
  { updateTeamInvitation, fetchInvitations, fetchTeams }
)(InvitationsList);

const TeamContainer = styled('div')`
  padding-bottom: ${variables.size16};
  margin-top: ${variables.size16};

  &:not(:last-child) {
    border-bottom: 1px solid ${variables.disabled};
  }
`;

const TeamImage = styled('div')`
  width: 100%;
  height: 100%;
  border-radius: 3px;
  border: 1px solid ${variables.disabled};
  background-color: ${variables.white};
`;

const TeamImageWrapper = styled('div')`
  border-radius: 3px;
  min-width: 3.5rem;
  max-width: 3.5rem;
  height: 3.5rem;
  margin-right: ${variables.size16};
`;

const TeamName = styled('div')`
  flex-grow: 1;
  font-weight: 600;
`;
