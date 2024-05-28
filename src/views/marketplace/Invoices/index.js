import React, { Component } from 'react';

import { connect } from 'react-redux';
import { fetchInvoices } from '../store/_actions';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import loader from 'assets/svg/general/loader.svg';

import Invoice from './Invoice';
import { ContentWrapper } from '../common';

const enhance = connect(
  state => ({
    invoices: state.marketplace.invoices.allIds.map(id => state.marketplace.invoices.byId[id]),
    fetching: state.marketplace.invoices.fetching
  }),
  { fetchInvoices }
);
class Invoices extends Component {
  componentDidMount() {
    this.props.fetchInvoices();
  }

  render() {
    const { invoices, fetching } = this.props;

    const showLoader = invoices.length === 0 && fetching;

    return (
      <ContentWrapper>
        <Container>
          <Title>Invoices</Title>
          {showLoader ? (
            <LoaderWrapper>
              <img alt="loader" width={48} height={48} src={loader} />
            </LoaderWrapper>
          ) : invoices.length > 0 ? (
            invoices.map((invoice, index) => (
              <Invoice key={invoice.id} {...invoice} number={invoices.length - index} />
            ))
          ) : (
            'You don’t have any Invoices yet'
          )}
        </Container>
      </ContentWrapper>
    );
  }
}

export default enhance(Invoices);

const LoaderWrapper = styled('div')`
  width: 100%;
  height: 330px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled('div')`
  font-size: 16px;
  font-weight: bold;
  margin: ${variables.size32} 0;
`;

const Container = styled('div')`
  width: 670px;
`;
