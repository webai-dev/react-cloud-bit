import React, { Component } from 'react';
import styled from 'react-emotion';
import SvgRender from 'components/general/SvgRender';

import variables from 'assets/sass/partials/_exports.scss';
import reminder from 'assets/svg/pinboard/reminder.svg';

export class ReminderPinView extends Component {
  render() {
    const {
      content: { content }
    } = this.props;
    return (
      <Reminder>
        <Header />
        <Body className="pin-reminder-wrapper">
          <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
        </Body>
        <SvgRender path={reminder} />
      </Reminder>
    );
  }
}

export default ReminderPinView;

const Reminder = styled('div')`
  padding: ${variables.size16} ${variables.size24};
  background: ${variables.bgGray};
`;
const Body = styled('div')`
  background: ${variables.yellow};
  padding: ${variables.size16};
  font-weight: 500;
  min-height: 194px;
  color: ${variables.darkBlue};
  .content {
    > :last-child {
      margin-bottom: 0;
    }

    p {
      word-wrap: break-word;
    }

    a {
      word-wrap: break-word;
    }
  }
`;
const Header = styled('div')`
  background: ${variables.yellow};
  opacity: 0.8;
  height: ${variables.size32};
`;
