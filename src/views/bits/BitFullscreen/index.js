import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchBit } from '../_actions';

import SimpleModal from 'components/modals/SimpleModal';
import SharingModal from 'views/shares/SharingModal';

import Header from './Header';
import BitFrame from '../BitFrame';

class FullscreenBit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: null,
      token: null,
      sandbox: window.Modernizr && window.Modernizr.sandbox ? true : false,
      modalOpen: false
    };
  }

  componentDidMount() {
    const bitId = this.props.match.params.bit_id;
    const teamId = this.props.active_team.id;

    if (teamId && this.state.sandbox) {
      this.props.fetchBit({ bit_id: bitId, team_id: teamId }).then(data => {
        if (data.path && data.path.length > 0) document.title = data.path[0].title + ' | yBit';

        if (!data.fullscreen) {
          this.props.history.push('/bit/' + bitId);
        }
        const shares =
          data.path &&
          data.path.reduce(
            (acc, p) => [...acc, ...p.shared_with.filter(user => !acc.includes(user))],
            []
          ).length;

        this.setState({ ...data, path: data.path.reverse(), shares: shares });
      });
    }
  }

  componentWillUnmount() {
    document.title = 'yBit';
  }

  toggleModal = () => this.setState(prev => ({ modalOpen: !prev.modalOpen }));

  render() {
    const { url, token, path, sandbox, modalOpen } = this.state;
    return (
      <Fragment>
        <Header fullscreen path={path} openModal={this.toggleModal} shares={this.state.shares} />
        <BitFrame url={url} token={token} sandbox={sandbox} fullscreen />
        <SimpleModal
          header="Share Bit"
          body={
            <SharingModal
              item={{ id: this.props.match.params.bit_id }}
              shareable_type="bit"
              toggle={this.toggleModal}
              onShareChange={shares => this.setState({ shares: shares.length })}
            />
          }
          modalOpen={modalOpen}
          toggle={this.toggleModal}
        />
      </Fragment>
    );
  }
}
export default compose(
  withRouter,
  connect(
    state => ({
      active_team: state.teams.active
    }),
    { fetchBit }
  )
)(FullscreenBit);
