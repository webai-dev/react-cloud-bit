import React, { Component } from 'react';
import SvgRender from 'components/general/SvgRender';

import rootFolder from 'assets/svg/ybit/root-folder.svg';

class RootFolder extends Component {
  render() {
    return (
      <div className={`d-flex align-items-end item-folder ${this.props.active ? 'active' : ''}`}>
        <div className="parent-wrap d-flex">
          <div
            className={`btn btn-share d-inline-flex align-items-center btn-empty btn-arrow ${
              this.props.open ? ' btn-open' : ''
            }`}
            data-collapse
            onClick={e => this.props.onClick('collapse')}
          />
          <div
            className="btn btn-share d-inline-flex align-items-center btn-empty btn-block"
            onClick={e => this.props.onClick('select')}
          >
            <SvgRender style={{ height: 16 }} path={rootFolder} />
            <span>yBit</span>
          </div>
        </div>
      </div>
    );
  }
}

export default RootFolder;
