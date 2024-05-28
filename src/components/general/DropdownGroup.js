import React, { Component } from 'react';
import styled from 'react-emotion';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

class DropdownGroup extends Component {
  constructor(props) {
    super(props);
    const { group, start } = this.props;
    const firstView = start ? group.find(v => v.key === start) : group[0];

    this.state = { current: firstView, previous: null, next: null };
  }

  firstView = () => {
    const { group, start } = this.props;
    return start ? group.find(v => v.key === start) : group[0];
  };

  next = targetKey => {
    const target = this.props.group.find(v => v.key === targetKey);
    this.setState({ next: target, previous: null }, () =>
      setTimeout(() => this.setState({ current: target, previous: null, next: null }), 100)
    );
  };

  previous = targetKey => {
    const target = this.props.group.find(v => v.key === targetKey);
    this.setState({ previous: target, next: null }, () =>
      setTimeout(() => this.setState({ current: target, previous: null, next: null }), 100)
    );
  };

  close = () => {
    this.setState({ current: this.firstView(), previous: null, next: null });
    this.props.toggle();
  };

  render() {
    const { control, group } = this.props;
    const { current, next, previous } = this.state;
    return (
      <Dropdown isOpen={this.props.isOpen} toggle={this.close}>
        <DropdownToggle className={`btn-empty`}>{control()}</DropdownToggle>
        <Menu width={current.width} height={current.height}>
          {group.map(view => {
            if (previous && view.key === previous.key) {
              return (
                <DropdownMenuGroup
                  key={previous.key}
                  width={previous.width}
                  active={false}
                  offset={-previous.width}
                  display={'block'}
                >
                  {previous.render(this.next, this.previous)}
                </DropdownMenuGroup>
              );
            } else if (current && view.key === current.key) {
              return (
                <DropdownMenuGroup
                  key={current.key}
                  width={current.width}
                  active={true}
                  offset={0}
                  display={'block'}
                >
                  {current.render(this.next, this.previous)}
                </DropdownMenuGroup>
              );
            } else if (next && view.key === next.key) {
              return (
                <DropdownMenuGroup
                  key={next.key}
                  width={next.width}
                  active={false}
                  offset={current.width}
                  display={'block'}
                >
                  {next.render(this.next, this.previous)}
                </DropdownMenuGroup>
              );
            } else {
              return (
                <DropdownMenuGroup key={view.key} display={'none'}>
                  {view.render(this.next, this.previous)}
                </DropdownMenuGroup>
              );
            }
          })}
        </Menu>
      </Dropdown>
    );
  }
}
export default DropdownGroup;

const Menu = styled(DropdownMenu)`
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 4px 6px 32px -3px #9e9e9e;

  overflow: hidden;
  transition: all 200ms ease;

  width: ${props => props.width}px;
  min-height: ${props => (props.height ? props.height : 0)}px;
  position: relative;

  transform: translate3d(5px, 40px, 0px) !important;
`;

const DropdownMenuGroup = styled('div')`
  width: ${props => props.width}px;
  display: ${props => props.display};
  position: ${props => (props.active ? 'static' : 'absolute')};
  will-change: transform, opacity;
  transition-property: transform, opacity;
  transition-duration: 0.25s;
  height: 100%;
  opacity: ${props => (props.active ? 1 : 0)};

  transform: translateX(${props => props.offset}px);
  top: 0;
  left: 0;
`;
