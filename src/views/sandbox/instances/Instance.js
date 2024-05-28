import React, { Component } from 'react';
import ButtonIcon from 'components/general/ButtonIcon';

import { apiService } from 'utils/api';
import { withRouter } from 'react-router-dom';

import { BitsBreakpointsClasses } from 'utils/media';
import { minWidth } from 'utils/media';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export default class Instance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      instance: null
    };
  }

  componentDidMount() {
    const { typeId, instanceId } = this.props.match.params;
    apiService.get(`sandbox/types/${typeId}/instances/${instanceId}`).then(res => {
      this.setState({ instance: res.data });
    });
  }

  refreshIframe() {
    document.getElementById('instance-iframe').src = document.getElementById('instance-iframe').src;
  }

  render() {
    const { instance } = this.state;
    if (!instance) return null;

    const location = `${this.state.instance.display_url}/${this.state.instance.token}`;

    return (
      <div>
        <div className="bit-index-wrapper">
          <Frame
            className={`bit-wrapper grid-column-${instance.width} grid-row-${
              instance.height
            } ${BitsBreakpointsClasses(instance.width)}`}
          >
            <div className="bit-inner d-flex flex-column h-100">
              <Title>
                <span className="title text-truncate">{instance.title}</span>
                <div>
                  <div className="cursor-pointer" onClick={this.refreshIframe} title="Refresh">
                    <ButtonIcon icon="replace" />
                  </div>
                </div>
              </Title>
              <iframe
                title="Bit IFrame"
                id={`instance-iframe`}
                src={location}
                frameBorder="0"
                style={{ height: '100%' }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            </div>
          </Frame>
        </div>
      </div>
    );
  }
}

const Title = styled('div')`
  position: relative;
  width: 100%;
  color: ${variables.head};
  border-bottom: 1px solid ${variables.linesGray};
  height: 40px;
  margin-top: ${({ small }) => (small ? 4 : 8)}px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding-right: ${variables.size16};

  .btn-share {
    display: none;
  }

  &:hover {
    .btn-share {
      display: block;
    }
  }

  .title {
    font-size: ${variables.size14};
    padding: 0 ${variables.size8};
    position: relative;
    bottom: -${variables.size24};
    left: ${variables.size16};
    background: #fff;
    font-weight: 500;
    max-width: calc(100% - 120px);

    ${minWidth.xl + `{  font-size: ${variables.size16};}`};
    ${minWidth.hd + `{  font-size: ${variables.size20};}`};
  }
`;

const Frame = styled('div')`
  > .bit-inner {
    height: 100%;
    background: #fff;
    border: 1px solid ${variables.linesGray};
    border-radius: 3px;
  }

  &:hover > .bit-inner,
  &.selected > .bit-inner {
    box-shadow: 0px 4px 10px 0px ${variables.linesGray};
  }

  .dropdown-menu {
    overflow: hidden;
    transition: padding 200ms ease;

    &.settings-open {
      padding: 0 0 ${variables.size40} 0;
    }
  }
`;
