import React, { Component } from 'react';
import { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

class MaintenanceNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true
    };
  }

  types = [
    { value: 'improvements', label: 'Improvements', color: '#7A5AB2' },
    {
      value: 'under_construction',
      label: 'Under Construction',
      color: variables.red
    },
    { value: 'downtime', label: 'Downtime', color: '#EA7C24' }
  ];

  render() {
    const { maintenances } = this.props;

    if (!maintenances || process.env.NODE_ENV == 'test') {
      return null;
    }

    const type = this.types.find(t => t.value === maintenances.type);

    return type ? (
      <div
        className={`d-flex py-2 align-items-center justify-content-between position-absolute ${
          this.state.show ? 'active' : ''
        } ${notificationClass}`}
      >
        <div className="position-absolute bg" style={{ backgroundColor: type.color }} />
        <div
          style={{ color: type.color }}
          className="position-relative text-align-center pl-8 pr-5"
          dangerouslySetInnerHTML={{ __html: maintenances.description }}
        />
        <div
          style={{ color: type.color }}
          className="close position-relative mr-2"
          onClick={() => this.setState({ show: false })}
        >
          ×
        </div>
      </div>
    ) : null;
  }
}

export default MaintenanceNotification;

const notificationClass = css`
  top: -100%;
  transition:all 2s;
  background:${variables.white}
  max-width: 37.5rem;
  min-width: ${variables.size136};
  right: 5%;
  z-index: 100;
  min-height: ${variables.size64};
  font-size: ${variables.size14};
  line-height: ${variables.size16};
  border-radius: 0 0 ${variables.size4} ${variables.size4};
  overflow: hidden;
  .bg {
    height: 100%;
    width: 100%;
    opacity: 0.3;
    z-index: -1;
  }

  &.active{
    top:0;
  }

  .close {
    opacity: 1;
  }
`;
