import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { successHandler, MSG } from 'utils/alerts';

import SvgRender from 'components/general/SvgRender';
import link from 'assets/svg/actions/link.svg';
import { UncontrolledTooltip } from 'reactstrap';

class CopyButton extends Component {
  copyStringToClipboard(e) {
    const el = document.createElement('textarea');
    el.value = `${window.location.origin}/${this.props.type}/${this.props.id}`;
    el.setAttribute('readonly', '');
    el.style = { display: 'none' };

    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    this.props.onClick();
  }

  render() {
    return (
      <Fragment>
        <div
          id={`copy-url-${this.props.id}`}
          className="btn btn-copy d-inline-flex p-0"
          onClick={e => this.copyStringToClipboard(e)}
        >
          <SvgRender
            style={{ height: this.props.height || 18 }}
            className="copy-icon"
            path={link}
          />
        </div>
        {this.props.tooltip ? (
          <UncontrolledTooltip
            placement="top"
            delay={{ show: 100 }}
            target={`copy-url-${this.props.id}`}
          >
            Copy URL
          </UncontrolledTooltip>
        ) : null}
      </Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    successHandler(dispatch, MSG.COPY_URL);
  }
});

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CopyButton);
