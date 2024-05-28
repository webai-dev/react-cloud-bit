import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import ActivityIcon from './ActivityIcon';
import ActivityDescription from './ActivityDescription';
import { format } from 'utils/dates';

class ActivityAction extends Component {
  render() {
    const { action, user, created, changes, metadata, mode } = this.props;

    return (
      <Action>
        <div className="d-flex align-items-center justify-content-start">
          <div className="activity_icon d-flex justify-content-center align-items-center">
            <ActivityIcon action={action} />
          </div>
          <div className="activity_text d-flex">
            <div className="activity_date">{format(created)}</div>
            <ActivityDescription
              user={user}
              action={action}
              mode={mode}
              changes={changes}
              metadata={metadata}
              getRightFunction={this.getRightFunction}
            />
          </div>
        </div>
      </Action>
    );
  }
}
export default ActivityAction;

const Action = styled('div')`
  margin-top: ${variables.size40};
  span {
    font-weight: bold !important;
  }
  .blue {
    color: ${variables.blue};
  }
  .activity_text {
    flex-direction: column;
  }
  .activity_date {
    font-weight: 300;
    color: ${variables.secondary};
    font-size: ${variables.size12};
    margin-bottom: ${variables.size2};
  }
  .activity_icon {
    height: 34px;
    width: 34px;
    border: 1px solid ${variables.disabled};
    border-radius: 25px;
    background-color: ${variables.bgGray};
    margin-right: ${variables.size16};
    flex-shrink: 0;
    z-index: 5;

    svg {
      width: ${variables.size20};
      height: ${variables.size20};
      transform: scale(0.7);
    }
  }
`;
