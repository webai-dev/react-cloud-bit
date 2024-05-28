import bullets from 'assets/svg/general/bullets.svg';
import ButtonIcon from 'components/general/ButtonIcon';
import SvgRender from 'components/general/SvgRender';
import React, { Component } from 'react';
import { css } from 'react-emotion';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

class Actions extends Component {
  state = {
    isOpen: false
  };

  toggle = () => this.setState(prev => ({ isOpen: !prev.isOpen }));

  render() {
    const { keep, action } = this.props;
    return (
      <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
        <DropdownToggle className={`btn-dropdown btn-empty btn-smaller btn-small-border`}>
          <SvgRender style={{ height: 16 }} path={bullets} className={Rotate} />
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem
            className="btn dropdown-item btn-dropdown-icon btn-download-icon"
            onClick={() => action('download')}
          >
            <ButtonIcon icon="download">Download</ButtonIcon>
          </DropdownItem>
          <DropdownItem
            className="btn dropdown-item btn-dropdown-icon btn-download-icon"
            onClick={() => action('rename')}
          >
            <ButtonIcon icon="edit">Rename</ButtonIcon>
          </DropdownItem>
          <div
            className="btn dropdown-item btn-dropdown-icon btn-download-icon"
            onClick={() => {
              action('keep-forever');
              this.toggle();
            }}
          >
            <button type="button" className={`btn btn-select ${keep ? 'active' : ''} mr-1`} />
            Keep forever
          </div>
          <DropdownItem
            className="btn dropdown-item btn-dropdown-icon btn-download-icon"
            onClick={() => action('delete')}
          >
            <ButtonIcon icon="delete">Delete</ButtonIcon>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}
export default Actions;

const Rotate = css`
  transform: rotate(90deg);
`;
