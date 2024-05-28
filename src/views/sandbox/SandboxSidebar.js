import React, { Component } from 'react';
import SvgRender from 'components/general/SvgRender';
import { Link, withRouter } from 'react-router-dom';

import { compose } from 'redux';
import { connect } from 'react-redux';
import styled from 'react-emotion';

import variables from 'assets/sass/partials/_exports.scss';

class SandboxSidebar extends Component {
  render() {
    const { types, match } = this.props;
    return (
      <div className="pt-1">
        <div className="pl-2">
          <Link to="/sandbox/types/new">
            <ButtonWrapper>
              <SvgRender
                style={{ height: 14, marginRight: 12 }}
                path={require('assets/svg/actions/create.svg')}
              />
              NEW
            </ButtonWrapper>
          </Link>
        </div>

        <div className="mt-3">
          {types.map((type, index) => {
            const link = `/sandbox/types/${type.id}`;
            const active = match.url.startsWith(link);

            return (
              <Link
                to={`/sandbox/types/${type.id}`}
                className={`sandbox-sidebar-link ${active ? 'active' : ''}`}
                key={index}
              >
                {type.name}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    types: state.sandbox.types
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps)
)(SandboxSidebar);

const ButtonWrapper = styled('div')`
  width: 100%;

  display: flex;

  align-items: center;

  font-size: ${variables.size18};
  font-weight: bold;
  line-height: ${variables.size22};
  font-size: ${variables.size16};
  color: ${variables.head};

  margin-left: ${variables.size24};

  path {
    fill: ${variables.blue};
  }

  cursor: pointer;
`;
