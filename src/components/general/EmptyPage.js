import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'react-emotion';
import { minWidth, SidebarBreakpointsWidth } from 'utils/media';
import variables from 'assets/sass/partials/_exports.scss';

import LoadingPage from 'components/general/LoadingPage';
import SvgRender from 'components/general/SvgRender';
import flagged from 'assets/svg/pinboard/flagged.svg';
import pinboard from 'assets/svg/pinboard/empty-pinboard.svg';
import dashboard from 'assets/svg/general/dashboard-colored.svg';
import sharedFolder from 'assets/svg/general/shared-folder-avatar.svg';
import rootFolder from 'assets/svg/ybit/root-folder.svg';
import folder from 'assets/svg/general/folder.svg';
import search from 'assets/svg/actions/search.svg';
import sandbox from 'assets/svg/team/sandbox.svg';

class EmptyPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  _delay = 500;
  _mounted = false;

  async setLoading() {
    setTimeout(() => {
      if (this._mounted !== false)
        this.setState({ loading: this.props.loading !== undefined ? this.props.loading : false });
    }, this._delay);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.loading !== this.state.loading) this.setLoading();
  }

  componentDidMount() {
    this._mounted = true;
    if (this.props.loading !== this.state.loading) this.setLoading();
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    const { icon, width, opacity, children } = this.props;
    const { loading } = this.state;
    const iconStyle = { width: '128px', height: '8rem', opacity: 0.5 };

    if (width) iconStyle.width = width;
    if (opacity) iconStyle.opacity = opacity;

    return (
      <Page className="d-flex align-items-center justify-content-center flex-column">
        {loading !== undefined && <LoadingPage loading={loading} />}

        <div
          className={`align-items-center justify-content-center flex-column empty-page-inner ${
            loading === true ? 'd-none' : 'd-flex'
          }`}
        >
          <SvgRender path={icon} style={iconStyle} />
          <Content className="text-center">{children}</Content>
        </div>
      </Page>
    );
  }
}

export default EmptyPage;

export const EmptyFlaggedPins = props => (
  <EmptyPage icon={pinboard} loading={props.loading}>
    <p>You don’t have any flagged pins.</p>
    <PWithIcon>
      Use the
      <SvgRender
        path={flagged}
        className="favourite-icon"
        wrapperClassName="btn btn-empty active pl-1 pr-1"
        style={{ height: 18 }}
      />
      to flag them.
    </PWithIcon>
  </EmptyPage>
);

export const EmptyPinboard = props => (
  <EmptyPage icon={pinboard} loading={props.loading}>
    <h4>Welcome to the team Pinboard!</h4>
    <p>
      You can create pins with text, videos, reminders and announcements and share them with your
      teammates!
    </p>
  </EmptyPage>
);

export const EmptyDashboard = props => (
  <EmptyPage icon={dashboard} loading={props.loading}>
    <h4>Welcome to Dashboard!</h4>
    <p>Create your Dashboard with your preferred assets </p>
    <PWithIcon>
      by clicking the
      <SvgRender
        path={dashboard}
        className="favourite-icon"
        wrapperClassName="btn btn-empty active pl-1 pr-1"
        style={{ height: 18 }}
      />
      on every file, folder or bit.
    </PWithIcon>
  </EmptyPage>
);

export const EmptySandbox = props => (
  <EmptyPage icon={sandbox} loading={props.loading}>
    <h4>Welcome to Sandbox!</h4>
    <p>
      Create your first bit type here <Link to="/sandbox/types/new">here!</Link>
    </p>
  </EmptyPage>
);

export const EmptyShared = props => (
  <EmptyPage icon={sharedFolder} loading={props.loading}>
    <h4>Welcome to the team Shared folder</h4>
    <p>You have no shared items yet.</p>
  </EmptyPage>
);

export const EmptyRoot = props => (
  <EmptyPage icon={rootFolder} loading={props.loading}>
    <h4>Welcome to the ybit folder.</h4>
    <p>
      Create your first folder to start organizing your files & bits by clicking on the "folder" or
      "bit" button.
    </p>
  </EmptyPage>
);

export const EmptyFolder = props => (
  <EmptyPage icon={folder} loading={props.loading}>
    <p>
      Drag and drop files here <br /> or use the New button to create new folders and bits.
    </p>
  </EmptyPage>
);

export const EmptySearch = props => (
  <EmptyPage icon={search} loading={props.loading}>
    <p>No search results were found.</p>
  </EmptyPage>
);

const Page = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  ${minWidth.xs + '{ width: calc(100% - ' + SidebarBreakpointsWidth.xs + '); }'};
  ${minWidth.sm + '{ width: calc(100% - ' + SidebarBreakpointsWidth.sm + '); }'};
  ${minWidth.md + '{ width: calc(100% - ' + SidebarBreakpointsWidth.md + '); }'};
  ${minWidth.lg + '{ width: calc(100% - ' + SidebarBreakpointsWidth.lg + '); }'};
  ${minWidth.xl + '{ width: calc(100% - ' + SidebarBreakpointsWidth.xl + '); }'};
`;

const Content = styled('div')`
  color: ${variables.textSec};
  margin-top: ${variables.size32};
  max-width: 25vw;

  h4 {
    color: inherit;
  }

  p {
    margin-bottom: ${variables.size8};
  }
`;

const PWithIcon = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`;
