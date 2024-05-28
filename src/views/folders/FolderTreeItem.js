import React, { Component } from 'react';
import orderBy from 'lodash/orderBy';
import SvgRender from 'components/general/SvgRender';

import sharedFolder from 'assets/svg/general/shared-folder.svg';

class FolderTreeItem extends Component {
  render() {
    const {
      folder,
      active,
      active_clicked_folder_id,
      collapsed,
      handleShareClick,
      folders,
      rightClick
    } = this.props;

    const current_id = folder.id;
    const path = folder.path ? folder.path : [];
    const children = folders.filter(f => f.folder_id === current_id);

    return (
      <li
        key={current_id}
        className={`d-flex align-items-end item-folder${active == current_id ? ' active' : ''}${
          active_clicked_folder_id == current_id && rightClick ? ' click-active' : ''
        }`}
        data-id={current_id}
      >
        <div className="parent-wrap d-flex pl-4">
          {path.map((p, j) => {
            return <div className="spacing-share" key={j} />;
          })}

          <div
            className={`btn btn-share d-inline-flex align-items-center btn-empty btn-arrow
              ${collapsed[current_id] ? ' btn-open' : ''}`}
            data-collapse
            onMouseDown={e => handleShareClick(e, folder)}
            onContextMenu={e => handleShareClick(e, folder)}
          />

          <div
            className="btn btn-share d-inline-flex align-items-center btn-empty btn-block"
            onMouseDown={e => handleShareClick(e, folder)}
            onContextMenu={e => handleShareClick(e, folder)}
          >
            <SvgRender
              className={`${folder.is_shared > 0 ? 'folder-shared' : ''}`}
              wrapperClassName={folder.is_shortcut ? 'shortcut-icon-small' : ''}
              style={{ height: 16, width: 16 }}
              path={sharedFolder}
            />
            <span>{folder.title}</span>
          </div>
        </div>

        {collapsed[current_id] && children.length > 0 && (
          <div className="child-wrap">
            <ul className="list-unstyled shares-list inner-shares-list">
              {orderBy(children, [s => s.title.toLowerCase()], ['asc']).map((s, j) => {
                return (
                  <FolderTreeItem
                    key={s.id}
                    folder={s}
                    collapsed={this.props.collapsed}
                    active={active}
                    active_clicked_folder_id={active_clicked_folder_id}
                    handleShareClick={this.props.handleShareClick}
                    handleExpandClick={this.props.handleExpandClick}
                    folders={this.props.folders}
                  />
                );
              })}
            </ul>
          </div>
        )}
      </li>
    );
  }
}

export default FolderTreeItem;
