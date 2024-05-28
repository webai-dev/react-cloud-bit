import React, { Component } from 'react';
import Tabs from 'components/general/Tabs';
import YbitTerms from './YbitTerms';
import ApparatusTerms from './ApparatusTerms';
import SvgRender from 'components/general/SvgRender';

import ybitSvg from 'assets/svg/legal/ybit.svg';
import apparatusSvg from 'assets/svg/legal/apparatus.svg';

export default class TermsTabs extends Component {
  constructor(props) {
    super(props);

    this.tabs = {
      ybit: {
        button: props => (
          <div {...props}>
            <SvgRender style={{ height: 18 }} path={ybitSvg} />
          </div>
        ),
        content: YbitTerms
      },
      apparatus: {
        button: props => (
          <div {...props}>
            <SvgRender path={apparatusSvg} />
          </div>
        ),
        content: ApparatusTerms
      }
    };
  }

  render() {
    const { hasAcceptedYbitTerms, hasAcceptedApparatusTerms } = this.props;

    const tabs = [
      ...(!hasAcceptedYbitTerms ? [this.tabs.ybit] : []),
      ...(!hasAcceptedApparatusTerms ? [this.tabs.apparatus] : [])
    ];

    return <Tabs buttonsClassName="curved-tabs" contentClassName="modal-main" tabs={tabs} />;
  }
}
