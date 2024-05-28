import React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';
import Sidebar from 'components/layouts/sidebar';

import Filters from './tabs/Filters';
import Info from './tabs/Info';
import File from './tabs/file';

import { hideSidebar } from './_actions';

const getActiveTabComponent = tab => {
  switch (tab) {
    case 'filter':
      return Filters;
    case 'info':
      return Info;
    case 'file_details':
      return File;
    default:
      return null;
  }
};

const RightSidebar = ({ activeTab, show, ...rest }) => {
  const Tab = getActiveTabComponent(activeTab);
  return (
    <Sidebar position="right" show={show} width={400}>
      <Wrapper className="d-flex flex-column">
        <Tab {...rest} />
      </Wrapper>
    </Sidebar>
  );
};

const mapStateToProps = state => ({
  activeTab: state.sidebar.activeTab
});

const mapDispatchToProps = dispatch => ({
  hideSidebar: () => dispatch(hideSidebar())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RightSidebar);

const Wrapper = styled('div')`
  width: 100%;
  background-color: #ffffff;
  box-shadow: -2px 0 4px 0 rgba(0, 0, 0, 0.05);
`;
