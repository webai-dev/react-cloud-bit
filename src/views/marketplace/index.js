import React, { Component } from 'react';
import { apiService } from 'utils/api';

import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { fetchBitTypes } from 'views/bits/_actions';
import { errorHandler, MSG } from 'utils/alerts';

import { Row, Col } from 'reactstrap';

import Header from 'components/layouts/header';
import NavBar from './Navbar';

import Bits from './Bits';
import Plans from './Plans';
import Invoices from './Invoices';
import Payments from './Payments';
import Contact from './Contact';

const enhance = compose(
  withRouter,
  connect(
    state => ({
      active_team: state.teams.active,
      hasPermission: ['owner', 'admin'].includes(state.user.role.label),
      hasFetchedRole: state.user.role.label !== 'initial'
    }),
    dispatch => ({
      fetchBitTypes: () => dispatch(fetchBitTypes()),
      errorHandler: message => errorHandler(dispatch, message)
    })
  )
);
class Marketplace extends Component {
  componentDidMount() {
    this.props.fetchBitTypes();
    this.checkPermissions();
  }

  componentDidUpdate() {
    this.checkPermissions();
  }

  checkPermissions() {
    if (this.props.hasFetchedRole && !this.props.hasPermission) {
      this.props.errorHandler({ data: { message: MSG.MARKETPLACE_ACCESS } });
      this.props.history.goBack();
    }
  }

  getTabComponent = path => {
    if (path.startsWith('/marketplace/plans')) return Plans;
    else if (path.startsWith('/marketplace/payments')) return Payments;
    else if (path.startsWith('/marketplace/invoices')) return Invoices;
    else if (path.startsWith('/marketplace/contact')) return Contact;
    else return Bits;
  };

  render() {
    const { match, location, active_team } = this.props;
    const Tab = this.getTabComponent(location.pathname);

    return (
      <div className="content-inner-wrapper">
        <Header title={'Settings'} render={() => <NavBar />} />
        <Row>
          <Col xs="12">
            <Tab team={active_team} params={match.params} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default enhance(Marketplace);
