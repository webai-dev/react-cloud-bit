import React, { Component, Fragment } from 'react';
import { fileType, icon } from 'utils/files';

import { connect } from 'react-redux';
import { getTabsDetails } from '../../_selectors';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import SvgRender from 'components/general/SvgRender';
import close from 'assets/svg/actions/close.svg';

import Details from './details';
import Activity from './activity';

class FileDetails extends Component {
  state = { tab: 'details' };

  componentDidMount() {
    this.setState({ tab: 'details' });
  }

  componentDidUpdate(prevProps) {
    const { show } = this.props;
    const prevShow = prevProps.show;
    if (prevShow !== show) {
      this.setState({ tab: 'details' });
    }
  }

  setTab = tab => this.setState({ tab });

  selectedTab = () => {
    switch (this.state.tab) {
      case 'details':
        return Details;
      case 'activity':
        return Activity;
      default:
        return null;
    }
  };

  render() {
    const { file, hideSidebar, mode } = this.props;

    const SelectedTab = this.selectedTab();
    const withPreview = file && fileType(file.mime_type, file.extension).type === 'image';
    return file ? (
      <Fragment>
        <div className="d-flex flex-column px-4 pt-4 pb-2">
          <div className="d-flex justify-content-between align-items-center">
            {!withPreview && mode === 'file' && (
              <SvgRender
                className="icon"
                path={icon(file.mime_type, file.extension)}
                style={{ height: 26, marginRight: 12, marginLeft: -8 }}
                wrapperClassName="thumb-svg"
              />
            )}
            <Title>{file.title}</Title>
            <IconButton onClick={hideSidebar}>
              <SvgRender style={{ height: 16 }} path={close} />
            </IconButton>
          </div>
        </div>
        <TabList>
          <Tab onClick={() => this.setTab('details')} active={this.state.tab === 'details'}>
            Details
          </Tab>
          <Tab onClick={() => this.setTab('activity')} active={this.state.tab === 'activity'}>
            Activity
          </Tab>
        </TabList>

        <Main className="d-flex flex-column">
          <SelectedTab
            mode={this.props.mode}
            {...file}
            withPreview={mode === 'file' ? withPreview : null}
          />
        </Main>
      </Fragment>
    ) : null;
  }
}

export default connect(state => ({
  file: getTabsDetails(state),
  state: state,
  activeTab: state.sidebar.activeTab,
  show: state.sidebar.show,
  mode: state.sidebar.mode
}))(FileDetails);

const Title = styled('div')`
  font-size: ${variables.size20};
  font-weight: 600;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  margin-right: ${variables.size16};
`;

const IconButton = styled('div')`
  cursor: pointer;
`;

const TabList = styled('div')`
  display: flex;
  justify-content: center;
  padding: 0 ${variables.size24};
  align-items: center;

  border-bottom: 2px solid ${variables.iconInactive};
`;

const Main = styled('div')`
  flex: 1;
  height: 100%;
`;

const Tab = styled('div')`
  font-weight: 600;
  padding: ${variables.size16} ${variables.size56};
  color: ${({ active }) => (active ? 'inherit' : variables.iconInactive)};
  box-shadow: 0 2px 0 0 ${({ active }) => (active ? variables.head : variables.iconInactive)};
  cursor: pointer;
`;
