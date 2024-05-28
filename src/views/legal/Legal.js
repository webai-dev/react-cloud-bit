import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TabContent,
  TabPane,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  Row,
  Col,
  Collapse
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import Cookies from './tabs/Cookies';
import Terms from './tabs/Terms';
import AcceptableUse from './tabs/AcceptableUse';
import Policy from './tabs/Policy';
import BusinessAgreement from './tabs/BusinessAgreement';
import DMCAPolicy from './tabs/DMCAPolicy';

class Legal extends Component {
  constructor() {
    super();

    this.state = {
      content: [
        { title: 'Privacy Policy', path: 'privacy-policy', component: <Policy /> },
        { title: 'Terms of Service', path: 'terms-of-service', component: <Terms /> },
        {
          title: 'Business Agreement',
          path: 'business-agreement',
          component: <BusinessAgreement />
        },
        { title: 'DMCA Policy', path: 'dmca-policy', component: <DMCAPolicy /> },
        { title: 'Acceptable Use', path: 'acceptable-use', component: <AcceptableUse /> },
        { title: 'Use of Cookies', path: 'use-of-cookies', component: <Cookies /> }
      ],
      isOpen: false
    };

    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const activeTab =
      this.props.match.params.page !== undefined
        ? this.state.content.findIndex(c => c.path === this.props.match.params.page)
        : 1;

    return this.state.content[activeTab] ? (
      <div className="legal-wrapper pt-4 pt-lg-8">
        <Row>
          <Col lg="3">
            <Navbar expand="lg" className="with-background-legal with-light-bg p-0">
              <NavbarToggler
                onClick={this.toggleNavbar}
                className={
                  'd-flex d-lg-none align-items-center justify-content-between text-left px-0 w-100 btn' +
                  (this.state.isOpen ? ' show' : '')
                }
              >
                <h3 className="m-0">{this.state.content[activeTab].title}</h3>
              </NavbarToggler>
              <Collapse
                id="tabsMenu"
                isOpen={this.state.isOpen}
                className="justify-content-between align-items-start navbar-collapse"
              >
                <Nav tabs className="w-100">
                  {this.state.content.map((element, i) => (
                    <NavItem key={i}>
                      <NavLink
                        className="nav-link"
                        to={`/legal/${element.path}`}
                        exact={true}
                        onClick={this.toggleNavbar}
                      >
                        {element.title}
                      </NavLink>
                    </NavItem>
                  ))}
                </Nav>
              </Collapse>
            </Navbar>
          </Col>
          <Col>
            <TabContent activeTab={activeTab} className="mt-2 mt-lg-0">
              {this.state.content.map((element, i) => (
                <TabPane tabId={i} key={i} className="pb-8 pb-md-0">
                  <Row>
                    <Col xl={{ size: 8, offset: 1 }}>{element.component}</Col>
                  </Row>
                </TabPane>
              ))}
            </TabContent>
          </Col>
        </Row>
      </div>
    ) : null;
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {})(Legal);
