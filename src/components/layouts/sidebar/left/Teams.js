import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'react-emotion';

import { baseDomain } from 'utils/variables';
import variables from 'assets/sass/partials/_exports.scss';

class Teams extends Component {
  render() {
    const { teams } = this.props;
    return (
      <TeamsWrap>
        <div className="side-head mb-1">My Teams</div>
        <div className="side-teams">
          {teams.map(t => {
            return (
              <a
                key={t.id}
                href={`${window.location.protocol}//${t.subdomain}.${baseDomain()}`}
                target="_self"
                className="dropdown-item item-team d-flex align-items-center border-0 mb-1 pt-0"
              >
                {t.photo ? (
                  <img alt="team img" src={t.photo} width="24" height="24" />
                ) : (
                  <span className="team-av">{t.name[0]}</span>
                )}

                <span className="team-name pl-1">{t.name}</span>
              </a>
            );
          })}
        </div>
      </TeamsWrap>
    );
  }
}

export default connect(state => ({ teams: state.teams.list }))(Teams);

const TeamsWrap = styled('div')`
  margin-left:${variables.size16} 

  .side-head {
    font-size: ${variables.size16};
    font-weight: 600;
    padding: ${variables.size8} ${variables.size24};
  }

  .side-teams {
    > a {
      > img,
      > .team-av {
        width: ${variables.size32};
        height: ${variables.size32};
      }
    }
  }

  a {
    background-color: transparent !important;
    color: ${variables.head} !important;
  }
  
`;
