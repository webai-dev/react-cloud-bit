import React, { Component } from 'react';
import { css } from 'react-emotion';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import arrow from 'assets/svg/general/arrow.svg';
import variables from 'assets/sass/partials/_exports.scss';

import { getFolderFullPath } from 'views/folders/_helpers';
import SvgRender from 'components/general/SvgRender';
import bullets from 'assets/svg/general/bullets.svg';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import folderIcon from 'assets/svg/general/folder.svg';

export class Breadcrumbs extends Component {
  render() {
    const { active_team, folder, path } = this.props;

    let links = path ? [...path] : [];
    let innerLinks = [];
    if (links.length > 3) {
      innerLinks = links.splice(1, links.length - 1);
    }

    return active_team && active_team.id ? (
      <ul className={`${defaultClassName} list-unstyled d-flex m-0`}>
        {folder ? (
          <li className="pr-4">
            {folder.in_shared === true && folder.is_shortcut !== true ? (
              <NavLink exact to={`/shared`}>
                Shared with me
              </NavLink>
            ) : (
              <NavLink exact to={`/`}>
                yBit
              </NavLink>
            )}
          </li>
        ) : null}
        {links &&
          links.map((b, i) => {
            return (
              <li key={i} className="pr-4">
                <NavLink to={`/folder/${b.id}`}>{b.title}</NavLink>
              </li>
            );
          })}

        {innerLinks.length ? (
          <li className="pr-4 inner-nav">
            <UncontrolledDropdown className="d-flex h-100">
              <DropdownToggle className="d-flex h-100 align-items-center" tag="div">
                <SvgRender
                  style={{ width: 16, height: 16 }}
                  className={`filter-icon`}
                  path={bullets}
                />
              </DropdownToggle>
              <DropdownMenu className="py-1">
                {innerLinks.map((b, i) => {
                  return (
                    <DropdownItem tag="div" key={i} className={`btn  pl-${i == 0 ? '1' : i + 1}`}>
                      <NavLink className="d-flex" to={`/folder/${b.id}`}>
                        <img src={folderIcon} className="folder-img mr-2" /> {b.title}
                      </NavLink>
                    </DropdownItem>
                  );
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </li>
        ) : null}

        {folder && (
          <li className="pr-4">
            <NavLink to={`/folder/${folder.id}`}>{folder.title}</NavLink>
          </li>
        )}
      </ul>
    ) : null;
  }
}

function mapStateToProps(state, ownProps) {
  let folderId = ownProps.folderId ? ownProps.folderId : state.folders.active;
  const folder = folderId ? state.folders.list.find(f => f.id == folderId) : null;

  const path = ownProps.path ? ownProps.path : folder ? getFolderFullPath(folder, state) : [];

  return {
    active_team: state.teams.active,
    active_folder: state.folders.active,
    path,
    folder
  };
}

export default connect(
  mapStateToProps,
  {}
)(Breadcrumbs);

const defaultClassName = css`
  flex-wrap: wrap;
  min-height: ${variables.size32};

  li {
    font-size: ${variables.size16};
    position: relative;
    font-weight: 400;
    line-height: ${variables.size32};

    a {
      color: ${variables.secondary};

      &.active,
      &:hover {
        color: ${variables.head};
      }
    }

    &:last-child {
      a {
        color: ${variables.head} !important;
      }
      font-weight: 700;
      &:after {
        display: none;
      }
    }

    &:after {
      content: '';
      display: inline-block;
      position: absolute;
      right: ${variables.size8};
      width: ${variables.size16};
      height: ${variables.size16};
      top: ${variables.size8};
      background: url(${arrow});
      transform: rotate(-90deg);
    }
  }
  .inner-nav {
    .dropdown-item {
      height: ${variables.size32};
      padding: 0 ${variables.size16};
      &:last-child {
        border: none;
      }
      .folder-img {
        height: ${variables.size16};
        width: ${variables.size16};
      }
    }
    .dropdown-menu {
      min-width: 308px;
      width: auto;
    }
  }
`;
