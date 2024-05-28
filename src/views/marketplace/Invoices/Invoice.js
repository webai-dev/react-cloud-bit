import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { payInvoice, updateCard } from '../store/_actions';

import moment from 'moment';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import loader from 'assets/svg/general/loader.svg';
import SvgRender from 'components/general/SvgRender';

import { Checkout } from '../common';

const enhance = connect(
  null,
  { payInvoice, updateCard }
);
class Invoice extends Component {
  state = { loading: false };

  pay = () => {
    const { payInvoice, id } = this.props;
    this.setState({ loading: true });
    payInvoice(id).finally(() => this.setState({ loading: false }));
  };

  onToken = async token => {
    this.setState({ loading: true });
    await this.props.updateCard(token);
    this.pay();
  };

  render() {
    const { created_at, status, total, url, number, failedRetry } = this.props;
    const { loading } = this.state;

    return (
      <Container>
        {!loading ? (
          !failedRetry ? (
            <Fragment>
              <InfoContainer>
                <div>
                  <Text>Invoice #{number}</Text>
                  <SecondaryText>
                    Issued date: {moment.unix(created_at).format('DD/MM/YYYY')}
                  </SecondaryText>
                </div>
                <div className="text-right">
                  <Text>
                    Total: <b>${total / 100}</b>
                  </Text>
                  <Status status={status} />
                </div>
              </InfoContainer>

              <div className="slider">
                {(status === 'uncollectible' || status === 'overdue' || status === 'sent') && (
                  <Button onClick={this.pay}>Pay now</Button>
                )}
                {url && (
                  <Button
                    onClick={() => {
                      window.location.href = url;
                    }}
                  >
                    Download
                  </Button>
                )}
              </div>
            </Fragment>
          ) : (
            <FailContainer>
              <div className="warn mb-1">Payment failed</div>
              <Checkout onToken={this.onToken} description="Retry payment" label="Retry">
                <div className="update">Update payment info</div>
              </Checkout>
            </FailContainer>
          )
        ) : (
          <LoaderContainer>
            <img alt="loader" width={48} height={48} src={loader} />
          </LoaderContainer>
        )}
      </Container>
    );
  }
}
export default enhance(Invoice);

const Status = ({ status }) => {
  let displayStatus;
  if (status === 'sent') displayStatus = 'Scheduled';
  else displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <SecondaryText>
      status: <StatusText status={status}>{displayStatus}</StatusText>
    </SecondaryText>
  );
};

const Container = styled('div')`
  border-radius: 3px;
  border: 1px solid #e1e7ee;
  background-color: white;
  margin-bottom: ${variables.size16};
  &:last-child {
    margin-bottom: 0;
  }

  position: relative;

  .slider {
    width: 100%;
    display: flex;
    align-items: center;

    position: absolute;
    top: 0;
    left: 0;
    background: white;
    overflow-y: hidden;

    height: 0;

    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
  }

  &:hover {
    .slider {
      height: 90px;
    }
  }
`;

const Button = styled('div')`
  flex-grow: 1;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;

  font-size: ${variables.size16};
  font-weight: 600;

  color: ${variables.main};
  background: white;

  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: linear;

  &:hover {
    color: white;
    background: ${variables.main};
  }

  cursor: pointer;
`;

const InfoContainer = styled('div')`
  padding: ${variables.size24};
  display: flex;
  justify-content: space-between;
  cursor: pointer;

  transition-property: all;
  transition-duration: 0.3s;
  transition-timing-function: linear;
`;

const Text = styled('div')`
  font-size: ${variables.size16};
`;

const SecondaryText = styled('div')`
  font-size: ${variables.size12};
  color: ${variables.secondary};
`;

const StatusText = styled('span')`
  font-weight: 600;
  color: ${props => {
    switch (props.status) {
      case 'paid':
        return variables.green;
      case 'overdue':
      case 'uncollectible':
      case 'void':
        return variables.red;
      default:
        return variables.alertInfoColor;
    }
  }};
`;

const LoaderContainer = styled('div')`
  height: 90px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const FailContainer = styled(LoaderContainer)`
  flex-direction: column;
  align-items: center;

  font-size: ${variables.size16};
  text-transform: uppercase;
  .warn {
    font-weight: 600;
    color: ${variables.alertErrorColor};
  }
  .update {
    color: ${variables.main};
    cursor: pointer;
    font-size: ${variables.size14};
    &::after {
      content: '';
      display: inline-block;
      height: 6px;
      width: 6px;
      border-style: solid;
      border-color: inherit;
      border-width: 0px 1px 1px 0px;
      transform: rotate(-45deg);
      margin-left: 6px;
      margin-bottom: 2px;
    }
  }
`;
