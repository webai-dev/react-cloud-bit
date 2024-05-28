import React, { Component } from 'react';

import SvgRender from 'components/general/SvgRender';

import building_1 from 'assets/svg/public/building_1.svg';
import building_2 from 'assets/svg/public/building_2.svg';

class Cloud extends Component {
  render() {
    return (
      <div className={'buildings-wrapper d-none d-lg-flex align-items-end'}>
        <SvgRender path={building_2} style={{ height: 80 }} />
        <img src={building_1} height="256" className="ml-1" />
      </div>
    );
  }
}

export default Cloud;
