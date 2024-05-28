import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import SvgRender from 'components/general/SvgRender';

import styled from 'react-emotion';

import variables from 'assets/sass/partials/_exports.scss';
import create from 'assets/svg/actions/create-thin.svg';

import { baseDomain } from 'utils/variables';

class TeamsList extends React.Component {
  navigateToTeam(e, team) {
    const port =
      process.env.NODE_ENV === 'development' && window.location.port
        ? ':' + window.location.port
        : '';
    window.location.replace(
      `${window.location.protocol}//${team.subdomain}.${baseDomain() + port}`
    );
  }

  render() {
    const teams = this.props.teams;

    return (
      <div className="content-inner-wrapper">
        {teams.length > 0 ? (
          <div>
            <b className="d-block">You are already teammates into:</b>
            <small className="secondary-text">Select a prefered team:</small>
          </div>
        ) : (
          <div>
            <b className="d-block">You are not part of any team.</b>
          </div>
        )}

        <Row>
          {teams.map(team => {
            return (
              <Col xs="12" key={team.id}>
                <TeamContainer
                  className={`d-flex align-items-center pb-2 mt-2${
                    this.props.intro === true ? '' : ' cursor-pointer'
                  }`}
                  onClick={this.props.intro === true ? () => {} : e => this.navigateToTeam(e, team)}
                >
                  <TeamImageWrapper>
                    <TeamImage
                      style={{
                        backgroundImage: `url(${team.photo})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover'
                      }}
                    />
                  </TeamImageWrapper>
                  <div className="d-flex flex-column text-left mr-1">
                    <TeamName className="text-truncate">{team.name}</TeamName>
                    <OwnerTag>{this.props.user_id == team.user_id && 'Owner'}</OwnerTag>
                  </div>
                  {this.props.intro === true && (
                    <button
                      type="button"
                      className={`btn btn-white px-4 ml-auto`}
                      onClick={e => this.navigateToTeam(e, team)}
                    >
                      <strong>Get In</strong>
                    </button>
                  )}
                </TeamContainer>
              </Col>
            );
          })}
          <Col xs="12">
            <TeamContainer
              className="d-flex align-items-center pb-2 mt-2 cursor-pointer"
              onClick={this.props.createClick}
            >
              <PlusBox>
                <SvgRender
                  style={{ height: 16, margin: 'auto' }}
                  wrapperClassName={'w-100 h-100 justify-content-center'}
                  path={create}
                />
              </PlusBox>
              <div className="d-flex flex-column text-left">
                <div>Create a new Team</div>
              </div>
            </TeamContainer>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { teams: state.teams.list, user_id: state.user.id };
}

export default connect(
  mapStateToProps,
  {}
)(TeamsList);

const TeamContainer = styled('div')`
  border-bottom: 1px solid ${variables.disabled};
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

const OwnerTag = styled('small')`
  color: ${variables.secondary};
`;

const PlusBox = styled('div')`
  width: 3.5rem;
  height: 3.5rem;
  border: 2px dashed;
  border-color: ${variables.secondary};

  transition: all 0.3s ease;

  &:hover {
    border: 2px solid ${variables.secondary};
  }

  border-radius: 3px;
  background-color: ${variables.white};
  margin-right: ${variables.size16};
`;
