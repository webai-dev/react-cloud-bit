import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { css } from 'react-emotion';

import { TableAvatar, TableBody, TableCell, TableHeader, TableRow } from 'components/table';
import Header from 'components/layouts/header';
import Input from 'components/inputs';

import variables from 'assets/sass/partials/_exports.scss';
import { menu } from 'views/settings/_helpers';
import { fetchBitTypes, toggleBitTypes } from 'views/bits/_actions';

class Bits extends Component {
  componentDidMount() {
    this.props.fetchBitTypes({ team_id: this.props.active_team.id });

    document.title = 'Bit settings | yBit';
  }
  componentWillUnmount() {
    document.title = 'yBit';
  }

  render() {
    return (
      <div className="content-inner-wrapper">
        <Header
          title={'Settings'}
          menu={
            this.props.user.role.label === 'owner' || this.props.user.role.label === 'admin'
              ? menu
              : menu.filter(m => m.label !== 'team')
          }
        />

        <Row>
          <Col xs="12">
            <h5 className="mb-0">Bits</h5>
            <small className="secondary-text ">
              No credit card required. No setup fees. No obligation.
            </small>
          </Col>
          <Col xs="12" className="mt-4 col-lap-8 col-hd-5">
            <TableBody>
              <TableRow>
                <TableHeader small />
                <TableHeader title="NAME" />
                <TableHeader title="PRICE" />
                <TableHeader className="justify-content-center" title="SHOW BITS IN DROPDOWN" />
              </TableRow>

              {this.props.bit_types.map(t => (
                <TableRow key={t.id}>
                  <TableCell small className={BitAvatar}>
                    <TableAvatar name={t.name} image={t.icon} />
                  </TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell className="primary-text" />
                  <TableCell className="d-flex align-items-center justify-content-center">
                    <Input
                      tag="switch"
                      id={`bit-switch-${t.id}`}
                      classNameWrapper="mb-0"
                      checked={t.pivot.enabled}
                      onChange={() => this.props.toggleBitTypes({ id: t.id })}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    active_team: state.teams.active,
    bit_types: state.bits.types
  };
}

export default connect(
  mapStateToProps,
  { fetchBitTypes, toggleBitTypes }
)(Bits);

const BitAvatar = css`
  .avatar-wrapper {
    background: #fff;
    height: ${variables.size48};
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      height: ${variables.size32};
      width: auto;
    }
  }
`;
