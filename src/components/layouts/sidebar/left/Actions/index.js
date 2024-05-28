import React, { Component, Fragment } from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import DropdownGroup from 'components/general/DropdownGroup';
import SvgRender from 'components/general/SvgRender';

import Menu from './Menu';
import CreateFolder from './CreateFolder';
import SelectBitsFolder from './SelectBitsFolder';
import CreateBit from './CreateBit';
import create from 'assets/svg/actions/create-sequre.svg';
class PlusButton extends Component {
  state = { isOpen: false, selectedBitFolder: null, selectedType: null };

  selectFolder = id => this.setState({ selectedBitFolder: id });
  selectType = id => this.setState({ selectedType: id });

  toggle = () => this.setState(prev => ({ isOpen: !prev.isOpen }));

  render() {
    return (
      <Fragment>
        <DropdownGroup
          isOpen={this.state.isOpen}
          toggle={() => this.setState(prev => ({ isOpen: !prev.isOpen }))}
          control={() => (
            <ButtonWrapper>
              <SvgRender style={{ height: 14, marginRight: 12 }} path={create} />
              NEW
            </ButtonWrapper>
          )}
          group={[
            {
              key: 'menu',
              width: 266,
              height: 384,
              render: (next, previous) => <Menu next={next} onSelectType={this.selectType} />
            },
            {
              key: 'folder',
              width: 528,
              render: (next, previous) => (
                <CreateFolder close={this.toggle} previous={previous} next={next} />
              )
            },
            {
              key: 'bit-1',
              width: 528,
              render: (next, previous) => (
                <SelectBitsFolder
                  onSelect={this.selectFolder}
                  close={this.toggle}
                  previous={() => {
                    this.setState({ selectedBitFolder: null, selectType: null });
                    previous('menu');
                  }}
                  next={next}
                />
              )
            },
            {
              key: 'bit-2',
              width: 420,
              render: (next, previous) => (
                <CreateBit
                  close={this.toggle}
                  type={this.state.selectedType}
                  folder={this.state.selectedBitFolder}
                  previous={previous}
                />
              )
            }
          ]}
        />
      </Fragment>
    );
  }
}
export default PlusButton;

const ButtonWrapper = styled('div')`
  width: 100%;

  display: flex;

  align-items: center;

  font-size: ${variables.size18};
  font-weight: bold;
  line-height: 22px;
  color: ${variables.head};

  margin-left: ${variables.size24};

  path {
    fill: #85b7d9;
  }

  cursor: pointer;
`;
