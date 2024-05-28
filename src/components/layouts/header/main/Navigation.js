import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import Breadcrumbs from 'components/general/Breadcrumbs';

import Search from './Search';
import RightSideActions from './RightSideActions';
import { toggleSidebarVisibility } from 'components/layouts/sidebar/right/_actions';

import SvgRender from 'components/general/SvgRender';
import filter from 'assets/svg/general/filter.svg';
import info from 'assets/svg/general/info.svg';

class Navigation extends Component {
  showFolderOptions() {
    return (
      this.props.activeFolderId ||
      ['/', '/shared' /*, '/dashboard'*/].includes(this.props.location.pathname)
    );
  }

  render() {
    const { active_team, title, breadcrumbs, header_actions, toggleSidebar, sidebar } = this.props;

    return (
      <Row className="header-actions-wrapper align-items-center justify-content-between pt-3 pb-1">
        <Col xs="12">
          <Row>
            <Col xs="6">{active_team && active_team.id && <Search />}</Col>
            <Col xs="6" className="text-right">
              <RightSideActions />
            </Col>
          </Row>
        </Col>
        <Col xs="12" className="mt-auto">
          <Row>
            <Col xs="8">
              <div className="d-flex align-items-center">
                {title && !breadcrumbs && <h1 className="header-title">{title}</h1>}
                {breadcrumbs && <Breadcrumbs match={this.props.match} />}
                {header_actions && header_actions !== undefined ? header_actions : null}
              </div>
            </Col>
            <Col xs="4">
              {this.showFolderOptions() && (
                <div className="d-flex justify-content-end align-items-center pb-4 pr-3">
                  {/* <SelectedActions inShares={this.props.location.pathname === '/shared'} /> */}
                  <div onClick={() => toggleSidebar('filter')}>
                    <SvgRender
                      style={{ width: 20, height: 24 }}
                      className={`filter-icon ${sidebar.activeTab === 'filter' &&
                        sidebar.show === true &&
                        'active'}`}
                      path={filter}
                    />
                  </div>
                  {/*<div className="pl-2" onClick={() => toggleSidebar('info')}>
                    <SvgRender
                      style={{ width: 24 }}
                      className={`info-icon ${sidebar.activeTab === 'info' &&
                      sidebar.show === true &&
                      'active'}`}
                      path={info}
                    />
                    </div>*/}
                </div>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  sidebar: state.sidebar,
  activeFolderId: state.folders.active
});

const mapDispatchToProps = dispatch => ({
  toggleSidebar: tab => dispatch(toggleSidebarVisibility(tab))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Navigation));
