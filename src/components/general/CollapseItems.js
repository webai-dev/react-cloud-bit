import React, { Fragment, Component } from 'react';
import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import { Collapse } from 'reactstrap';

class CollapseItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsing: false
    };
  }

  onMoving = () => {
    this.setState({ collapsing: true });
  };

  onMovingStop = () => {
    this.setState({ collapsing: false });
  };

  render() {
    const { collapse, title, count, expand, children } = this.props;
    const { collapsing } = this.state;

    return (
      <Fragment>
        {collapse && (
          <Wrapper>
            <ClosedCol className="d-flex justify-content-between">
              <div>{`${title} (${count})`}</div>
              <ExpandButton onClick={expand}>Expand</ExpandButton>
            </ClosedCol>
          </Wrapper>
        )}
        <Collapse
          style={{ width: '100%' }}
          isOpen={!collapse}
          onEntering={this.onMoving}
          onExiting={this.onMoving}
          onExited={this.onMovingStop}
          onEntered={this.onMovingStop}
        >
          <div className={collapsing ? HideButtons : ''}>{children}</div>
        </Collapse>
      </Fragment>
    );
  }
}

export default CollapseItems;

const ClosedCol = styled('div')`
  font-size: ${variables.size12};
  color: ${variables.secondary};

  padding-bottom: ${variables.size8};

  border-bottom: 1px solid ${variables.linesGray};
`;

const Wrapper = styled('div')`
  width: 100%;
  padding-left: ${variables.size16};
  padding-right: ${variables.size16};
`;

const HideButtons = css`
  .btn.btn-select {
    display: none !important;
  }
`;

const ExpandButton = styled('div')`
  cursor: pointer;
  transition: all 0.3s ease;
  :hover {
    color: ${variables.primary};
  }
`;
