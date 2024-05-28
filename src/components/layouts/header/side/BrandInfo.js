import React, { Component, Fragment } from 'react';
import styled from 'react-emotion';

import variables from 'assets/sass/partials/_exports.scss';

class BrandInfo extends Component {
  render() {
    const { team, user, showUser } = this.props;

    return user && user.id ? (
      <BrandInfoStyle className="brand-info d-flex align-items-center justify-content-center">
        <Fragment>
          <div className="brand-info-photo">
            {showUser ? (
              user.photo ? (
                <img alt="team photo" src={user.photo} width="56" height="56" />
              ) : (
                <span>{user.name[0]}</span>
              )
            ) : team && team.photo ? (
              <img alt="team photo" src={team.photo} width="56" height="56" />
            ) : (
              <span>{team && team.name ? team.name[0] : ''}</span>
            )}
          </div>
          <div className="brand-info-text pl-1">
            <div className="brand-info-main text-truncate text-left">
              {showUser ? user.name : team ? team.name : ''}
            </div>
            <div className="brand-info-sec text-truncate text-left mt-1">
              {showUser ? user.email : user.name}
            </div>
          </div>
        </Fragment>
      </BrandInfoStyle>
    ) : null;
  }
}

export default BrandInfo;

const BrandInfoStyle = styled('div')`
  position: relative;
  max-width: 264px;

  .brand-info-photo {
    > img,
    > span {
      border-radius: 3px;
      border: 1px solid ${variables.linesGray};
    }

    > img {
      object-fit: cover;
    }

    > span {
      width: 56px;
      height: 56px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: ${variables.textHead};
      font-size: ${variables.size32};
    }
  }

  .brand-info-text {
    max-width: 132px;
    min-width: 132px;
    overflow: hidden;

    .brand-info-main {
      color: ${variables.textHead};
      font-size: ${variables.size16};
      font-weight: 500;
    }

    .brand-info-sec {
      color: ${variables.textSec};
      font-size: ${variables.size12};
    }
  }

  &:after {
    position: absolute;
    content: '';
    border: solid ${variables.textHead};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    display: inline-block;
    padding: 3px;
    right: -1rem;
    top: 12px;
  }
`;
