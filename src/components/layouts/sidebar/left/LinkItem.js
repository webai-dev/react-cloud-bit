import React, { Component } from 'react';
import { connect } from 'react-redux';
import SvgRender from 'components/general/SvgRender';
import { css } from 'react-emotion';
import { NavLink } from 'react-router-dom';

import variables from 'assets/sass/partials/_exports.scss';

class LinkItem extends Component {
  render() {
    const { to, text, icon, notifications, shared } = this.props;
    const hasNewShared = notifications.unread_notifications.some(
      not => not.subcategory === 'share'
    );

    return (
      <NavLink className={`d-flex align-items-center ${ItemStyle}`} to={to}>
        <div className="btn btn-share d-inline-flex align-items-center btn-empty">
          <SvgRender className={`folder-shared`} style={{ height: 16 }} path={icon} />
          <span>{text}</span>
          {hasNewShared && shared ? <span className="btn-share--new ml-1" /> : null}
        </div>
      </NavLink>
    );
  }
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    user: state.user,
    notifications: state.notifications.team
  };
}

export default connect(
  mapStateToProps,
  {}
)(LinkItem);

const ItemStyle = css`
  flex-wrap: wrap;
  position: relative;
  margin-left: ${variables.size32};

  &:before {
    content: '';
    position: absolute;
    width: calc(100% + ${variables.size40});
    height: 100%;
    left: -${variables.size40};
    top: 0;
  }

  .btn-share {
    height: auto;
    padding: ${variables.size4} 0 !important;
    z-index: 1;

    > div {
      height: ${variables.size16};
      padding-right: ${variables.size8};

      .folder-outer {
        fill: ${variables.sharedFolder} !important;
      }
    }

    > span {
      color: ${variables.head};
      z-index: 1;
      font-size: ${variables.size14};
      line-height: ${variables.size16};
      font-weight: 400;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.btn-share--new {
        background: ${variables.iconFlagged};
        width: ${variables.size8};
        height: ${variables.size8};
        border-radius: 100%;
      }
    }

    .folder-shared {
      .folder-shared {
        display: initial !important;
        fill: ${variables.bgGray} !important;
      }
    }
  }

  &:hover,
  &.active {
    > .btn-share {
      > div {
        .folder-outer {
          fill: ${variables.main} !important;
        }

        .folder-shared {
          fill: ${variables.bgGray} !important;
        }
      }
    }
  }

  &.active {
    &:before {
      background: #e0e6ed;
    }
  }
`;
