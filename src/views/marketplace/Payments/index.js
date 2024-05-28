import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCards, addCard, updateCard } from '../store/_actions';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import loader from 'assets/svg/general/loader.svg';

import { ContentWrapper, Checkout } from '../common';
import { Container as CardContainer, Button } from './common';
import Card from './Card';

const enhance = connect(
  state => {
    const { cards } = state.marketplace;
    return {
      cards: cards.allIds.map(id => cards.byId[id]),
      fetching: cards.fetching
    };
  },
  { fetchCards, addCard, updateCard }
);
class Payments extends Component {
  componentDidMount() {
    this.props.fetchCards();
  }

  onToken = async token => {
    this.props.addCard(token);
  };

  render() {
    const { cards, fetching } = this.props;
    const showLoader = cards.length === 0 && fetching;

    return (
      <ContentWrapper>
        <Title>Payment Methods</Title>
        {!showLoader ? (
          cards.length > 0 ? (
            cards.map(card => (
              <Card
                key={card.id}
                {...card}
                updateCard={this.props.updateCard}
                removeCard={this.props.removeCard}
              />
            ))
          ) : (
            <CardContainer style={{ position: 'relative' }}>
              <Card
                brand="MasterCard"
                last_4="1234"
                exp_year={23}
                exp_month={6}
                style={{ position: 'absolute', top: 0, left: 0, filter: 'blur(2px)' }}
              />
              <EmptyCard style={{ position: 'absolute', top: 0, left: 0 }}>
                You don’t have any Payment Method yet
                <div className="slider">
                  <Checkout onToken={this.onToken} description={'Add payment method'} label="Add">
                    <Button style={{ width: '344px', height: '180px' }}>update info</Button>
                  </Checkout>
                </div>
              </EmptyCard>
            </CardContainer>
          )
        ) : (
          <LoaderWrapper>
            <img alt="loader" width={48} height={48} src={loader} />
          </LoaderWrapper>
        )}
      </ContentWrapper>
    );
  }
}
export default enhance(Payments);

const LoaderWrapper = styled('div')`
  width: 330px;
  height: 200px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled('div')`
  font-size: 16px;
  font-weight: bold;
  margin: ${variables.size32} 0;
`;

const EmptyCard = styled('div')`
  width: 344px;
  height: 180px;

  background: rgba(255, 255, 255, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${variables.size16};
  font-weight: 600;
`;
