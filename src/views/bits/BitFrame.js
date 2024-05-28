import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import SvgRender from 'components/general/SvgRender';

const BitFrame = ({ url, token, sandbox, fullscreen, locked, type }) => {
  const location = `${url}/${token}`;

  return (
    <IframeWrapper fullscreen={fullscreen}>
      {locked ? (
        <NoSandbox
          className={
            'd-flex align-items-center justify-content-center flex-column text-center h-100 py-2 px-2'
          }
        >
          <SvgRender
            path={require('assets/svg/ybit/logo_grey.svg')}
            style={{ width: 90, height: 64, marginBottom: 40 }}
          />
          <div className="d-flex align-items-center text-secondary">
            <div className="mr-1">Contact admin to see </div>
            <img src={type.icon} style={{ width: 24, height: 24 }} alt="bit icon" />
            <div className="ml-1">Bit</div>
          </div>
        </NoSandbox>
      ) : (
        url &&
        token && (
          <Fragment>
            {sandbox ? (
              <iframe
                title="Bit IFrame"
                src={location}
                frameBorder="0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            ) : (
              <NoSandbox
                className={
                  'd-flex align-items-center justify-content-center text-center h-100 py-2 px-2 px-lg-5 px-hd-13'
                }
              >
                Download a latest version of a modern browser in order to see your bits
              </NoSandbox>
            )}
          </Fragment>
        )
      )}
    </IframeWrapper>
  );
};

export default connect((state, props) => ({
  type: state.bits.types.find(type => type.id === props.bit.type_id)
}))(BitFrame);

const IframeWrapper = styled('div')`
  width: 100%;
  height: ${props =>
    props.fullscreen
      ? `calc(100vh - ${variables.headerHFull})`
      : `calc(100% - ${variables.size88})`};
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
  }
`;

const NoSandbox = styled('div')`
  font-size: ${variables.size14};
`;
