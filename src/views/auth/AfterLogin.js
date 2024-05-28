import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import Header from 'components/layouts/header';
import SvgRender from 'components/general/SvgRender';

import InvitationsList from 'views/invitations/InvitationsList';
import TeamsList from 'views/teams/TeamsList';
import CreateTeamForm from 'views/teams/CreateTeamForm';
import { LoginWrapper } from 'utils/styles/auth';

import { fetchInvitations } from 'views/invitations/_actions';
import { fetchTeams } from 'views/teams/_actions';
import { fetchUser } from 'views/user/_actions';

import variables from 'assets/sass/partials/_exports.scss';

class AfterLogin extends Component {
  constructor(props) {
    super(props);

    this.state = { type: 'selection', loaded: false };
  }

  createClick() {
    this.setState({ type: 'create' });
  }

  componentWillMount() {
    this.props.fetchUser();
  }

  componentDidMount() {
    this.handleInitialization();
  }

  handleInitialization() {
    this.props.fetchTeams().then(() => {
      this.props.fetchInvitations().then(() => {
        this.setState({ loaded: true });
      });
    });
  }

  render() {
    const { invitations } = this.props;

    return (
      <LoginWrapper
        className={`after-login-inner home-wrapper d-flex align-items-center justify-content-center py-4`}
      >
        <Header
          logo={true}
          render={() => (
            <div className="d-flex h-100 align-items-center justify-content-end mr-6">
              <Link to="/logout">
                <div className="d-flex align-items-center">
                  <SvgRender
                    path={require('assets/svg/actions/logout.svg')}
                    style={{ height: 16, marginRight: 8 }}
                  />
                  Log out
                </div>
              </Link>
            </div>
          )}
        />

        {this.state.loaded && (
          <div className="login-inner d-flex align-items-center justify-content-center">
            {this.state.type === 'selection' && (
              <Row className={`selection-wrapper w-100 py-3 justify-content-center `}>
                <Col xs="5">
                  {invitations && invitations.length > 0 && <InvitationsList />}
                  {
                    <TeamsList
                      history={this.props.history}
                      createClick={this.createClick.bind(this)}
                      intro={true}
                    />
                  }
                </Col>
              </Row>
            )}

            {this.state.type === 'create' && (
              <Row className="flex-column align-items-center w-100">
                <Col xs="10" md="4" xl="3">
                  <HeaderText className="text-center mt-2">Create new team</HeaderText>
                  <div className="new-form-wrapper mt-10">
                    <CreateTeamForm goBack={e => this.setState({ type: 'selection' })} />
                  </div>
                </Col>
              </Row>
            )}
          </div>
        )}
      </LoginWrapper>
    );
  }
}
function mapStateToProps(state) {
  return {
    after_login: state.auth.after_login,
    invitations: state.invitations.list,
    teams: state.teams.list
  };
}

export default connect(
  mapStateToProps,
  {
    fetchTeams,
    fetchInvitations,
    fetchUser
  }
)(AfterLogin);

const HeaderText = styled('div')`
  font-size: ${variables.size32};
  font-weight: bold;
`;

const Link = styled(NavLink)`
  color: ${variables.head};
  font-size: ${variables.size14};
  cursor: pointer;
`;
