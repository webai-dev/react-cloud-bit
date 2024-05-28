import React, { Component, Fragment } from 'react';
import { apiService } from 'utils/api';

import { Collapse } from 'reactstrap';
import { Folder, File, Bit } from './display';

class Item extends Component {
  constructor(props) {
    super(props);

    switch (this.props.item.type) {
      case 'folder':
        this.displayComponent = Folder;
        break;
      case 'file':
        this.displayComponent = File;
        break;
      case 'bit':
      default:
        this.displayComponent = Bit;
        break;
    }

    this.state = { expanded: false, hasFetched: false, loading: false };
  }

  toggle = async () => {
    if (!this.state.hasFetched) await this.fetch();
    this.setState(prev => ({ expanded: !prev.expanded }));
  };

  fetch = async () => {
    if (this.props.item.type !== 'folder') return;

    let calls = [];
    if (this.props.show.includes('folders')) calls.push(this.fetchFolders);
    if (this.props.item.id && this.props.show.includes('files')) calls.push(this.fetchFiles);
    if (this.props.item.id && this.props.show.includes('bits')) calls.push(this.fetchBits);

    this.setState({ loading: true });
    await Promise.all(calls.map(call => call()));
    this.setState({ loading: false, hasFetched: true });
  };

  fetchFolders = async () => {
    let folders = [];
    if (this.props.item.id === null && this.props.item.shared) {
      const res = await apiService.get('/shares');
      folders = res.data;
    } else {
      const res = await apiService.get('/folders', { params: { folder_id: this.props.item.id } });
      folders = res.data.folders;
    }
    this.props.addItems(folders.map(folder => ({ ...folder, type: 'folder' })));
  };

  fetchFiles = async () => {
    let files = [];

    const res = await apiService.get('/files', { params: { folder_id: this.props.item.id } });
    files = res.data ? res.data : [];
    this.props.addItems(files.map(file => ({ ...file, type: 'file' })));
  };

  fetchBits = async () => {
    let bits = [];

    const res = await apiService.get('/bits', { params: { folder_id: this.props.item.id } });
    bits = res.data ? res.data : [];
    this.props.addItems(bits.map(bit => ({ ...bit, type: 'bit' })));
  };

  isSelected = () => {
    let directSelection = false;
    if (!this.props.multiple) {
      directSelection =
        this.props.selected &&
        this.props.selected.id === this.props.item.id &&
        this.props.selected.type === this.props.item.type;
    } else {
      directSelection = !!this.props.selected.find(
        item => item.id === this.props.item.id && item.type === this.props.item.type
      );
    }

    if (!this.props.multiple) return directSelection;
    else return this.props.parentSelected || directSelection;
  };

  itemChildren = () => {
    const { item, items, user } = this.props;
    return item.type === 'folder'
      ? items.filter(i => {
          return item.id
            ? i.folder_id === item.id
            : i.folder_id === null &&
                (item.shared
                  ? i.user_id !== user && !i.is_shortcut
                  : i.user_id === user || i.is_shortcut);
        })
      : [];
  };

  itemsPerms = () => {
    const { item, parentPerms, user } = this.props;

    let perm = 'show';
    if (item.user_id === user) perm = 'owner';
    else if (item.shares.find(share => share.share && share.user_id === user)) perm = 'share';
    else if (item.shares.find(share => share.edit && share.user_id === user)) perm = 'edit';

    if (!item.is_shortcut && parentPerms && this.permValue(parentPerms) > this.permValue(perm)) {
      perm = parentPerms;
    }
    return perm;
  };

  permValue = permString => {
    switch (permString) {
      case 'owner':
        return 3;
      case 'share':
        return 2;
      case 'edit':
        return 1;
      case 'show':
      default:
        return 0;
    }
  };

  isDisabled = () => {
    const { item, perms } = this.props;
    return item.id !== null && this.permValue(this.itemsPerms()) < this.permValue(perms);
  };

  renderChild = item => (
    <Item
      key={item.id}
      {...this.props}
      item={item}
      depth={this.props.depth + 1}
      parentSelected={this.isSelected()}
      parentPerms={this.itemsPerms()}
    />
  );

  sortAlpabetically = (a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  };

  render() {
    const { item, depth, onClick } = this.props;
    const { expanded, loading } = this.state;

    const selected = this.isSelected();
    const ItemComponent = this.displayComponent;
    const children = this.itemChildren().sort(this.sortAlpabetically);

    return (
      <Fragment>
        <ItemComponent
          {...item}
          expanded={expanded}
          toggle={this.toggle}
          selected={selected}
          onClick={() => onClick(item.id)}
          depth={depth}
          disabled={this.isDisabled()}
          loading={loading}
        />
        <Collapse isOpen={expanded}>
          {[
            ...children.filter(item => item.type === 'folder').map(this.renderChild),
            ...children.filter(item => item.type === 'file').map(this.renderChild),
            ...children.filter(item => item.type === 'bit').map(this.renderChild)
          ]}
        </Collapse>
      </Fragment>
    );
  }
}
export default Item;
