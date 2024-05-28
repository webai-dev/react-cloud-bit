import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { apiService } from 'utils/api';
import { connect } from 'react-redux';
import Item from './Item';

class Tree extends Component {
  state = {
    items: []
  };

  componentDidMount() {
    if (this.props.folders) {
      this.props.folders.forEach(this.fetchFolder);
    }
  }

  fetchFolder = async id => {
    const res = await apiService.get('/folders', { params: { folder_id: id } });
    this.addItems([
      { ...res.data.parent, type: 'folder' },
      ...res.data.folders.map(f => ({ ...f, type: 'folder' }))
    ]);
  };

  addItems = newItems =>
    this.setState(prev => ({
      items: [
        ...prev.items,
        ...newItems.filter(
          item =>
            !prev.items.find(
              i =>
                i.id === item.id &&
                i.folder_id === item.folder_id &&
                i.is_shortcut === item.is_shortcut
            )
        )
      ]
    }));

  getParents = id => {
    const { items } = this.state;
    let item = items.find(item => item.id === id);
    let parents = [];

    const equalsParent = i => i.id === item.folder_id;
    while (item && item.id !== null) {
      parents.push(item.folder_id);
      item = items.find(equalsParent);
    }
    return parents;
  };

  handleClick = id => {
    // Root and Shared with me are not selectable
    if (!id) return;
    // Check if the items type is
    if (!this.props.selectable.includes(this.state.items.find(item => item.id === id).type + 's'))
      return;

    const { multiple, selected, onSelect } = this.props;

    const { items } = this.state;
    if (!multiple) onSelect(items.find(item => item.id === id));
    else {
      if (selected.find(item => item.id === id)) {
        onSelect(selected.filter(item => item.id !== id));
      } else {
        const parents = this.getParents(id);
        let children = selected
          .filter(selectedItem => {
            const parents = this.getParents(selectedItem.id);
            return parents.includes(id);
          })
          .map(item => item.id);

        onSelect([
          ...selected.filter(item => !parents.includes(item.id) && !children.includes(item.id)),
          items.find(item => item.id === id)
        ]);
      }
    }
  };

  getTopLevelFolders = () => this.state.items.filter(item => this.props.folders.includes(item.id));

  renderItem = item => (
    <Item
      key={item.id ? item.id : item.shared ? 'shared' : 'root'}
      item={item}
      items={this.state.items}
      selected={this.props.selected}
      multiple={this.props.multiple}
      user={this.props.user}
      show={this.props.show}
      perms={this.props.perms}
      depth={0}
      addItems={this.addItems}
      onClick={this.handleClick}
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
    const { folders, root, shared } = this.props;
    return (
      <Fragment>
        {!folders
          ? [
              root &&
                this.renderItem({
                  id: null,
                  type: 'folder',
                  title: 'yBit',
                  shared: false,
                  shares: []
                }),
              shared &&
                this.renderItem({
                  id: null,
                  type: 'folder',
                  title: 'Shared with me',
                  shared: true,
                  shares: []
                })
            ]
          : this.getTopLevelFolders()
              .sort(this.sortAlpabetically)
              .map(this.renderItem)}
      </Fragment>
    );
  }
}

Tree.propTypes = {
  // the selected item or list of items
  selected: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  // is the sleection multiple or not
  multiple: PropTypes.bool,
  //gets called every time an item
  onSelect: PropTypes.func.isRequired,

  // user id
  user: PropTypes.number.isRequired,

  // show the ybit folder
  root: PropTypes.bool,
  // show the shared folder
  shared: PropTypes.bool,
  // or show specific folders (list of ids)
  folders: PropTypes.arrayOf(PropTypes.number),

  // which types of items to display
  show: PropTypes.arrayOf(PropTypes.oneOf(['folders', 'files', 'bits'])),
  // which types of items can be selected
  selectable: PropTypes.arrayOf(PropTypes.oneOf(['folders', 'files', 'bits'])),

  // disable all items without the reqired permissions
  perms: PropTypes.oneOf(['show', 'edit', 'share', 'owner'])
};

Tree.defaultProps = {
  multiple: false,
  root: true,
  shared: false,
  show: ['folders'],
  selectable: ['folders', 'files', 'bits'],
  perms: 'show'
};

export default connect(state => ({
  user: state.user.id
}))(Tree);
