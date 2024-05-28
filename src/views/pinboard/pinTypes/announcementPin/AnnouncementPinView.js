import React, { Component } from 'react';
import styled from 'react-emotion';
import moment from 'moment';
import variables from 'assets/sass/partials/_exports.scss';

export class AnnouncementPinView extends Component {
  render() {
    const {
      content: { title, date_from, date_to, content }
    } = this.props;
    const momentFrom = moment(date_from);
    const momentTo = moment(date_to);
    const daysText = `${momentFrom.date()} - ${momentTo.date()}`;
    const differentMonth = momentTo.month() !== momentFrom.month();
    const monthsText = `${momentFrom.format('MMMM')} ${
      differentMonth ? `- ${momentTo.format('MMMM')}` : ''
    }`;
    return (
      <AnnouncementPin>
        <Header>{monthsText}</Header>
        <Date>{daysText}</Date>
        <Content>
          <ContentTitle>{title}</ContentTitle>
          <ContentText dangerouslySetInnerHTML={{ __html: content }} />
        </Content>
      </AnnouncementPin>
    );
  }
}

export default AnnouncementPinView;

const AnnouncementPin = styled('div')`
  border: 1px solid ${variables.linesGray};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border-bottom: 0;
  border-top: 0;
`;

const Header = styled('div')`
  background: radial-gradient(ellipse at center, white 0%, white 36%, transparent 40%);
  background-color: ${variables.darkBlue};
  background-size: 35px 35px;
  background-repeat: repeat-x;
  background-position-y: -16px;
  color: white;
  padding: ${variables.size32} ${variables.size24} ${variables.size16};
  font-weight: 400;
  font-size: ${variables.size24};
`;

const Date = styled('div')`
  padding: ${variables.size24} ${variables.size40};
  font-size: ${variables.size80};
  font-weight: 200;
  letter-spacing: -4px;
`;
const Content = styled('div')`
  padding: ${variables.size16} ${variables.size24} ${variables.size32};
`;
const ContentTitle = styled('div')`
  font-size: ${variables.size16};
  font-weight: 500;
  margin-bottom: ${variables.size8};
`;
const ContentText = styled('div')`
  > :last-child {
    margin-bottom: 0;
  }

  p {
    word-wrap: break-word;
  }

  a {
    word-wrap: break-word;
  }
`;
