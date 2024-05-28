import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'reactstrap';
import orderBy from 'lodash/orderBy';

import RootFolder from 'components/general/RootFolder';
import FolderTreeItem from './FolderTreeItem';

import { setClickActiveFolder, setCollapseFolder, fetchFolders } from 'views/folders/_actions';
import { getFolderFullPath } from 'views/folders/_helpers';

let sidebarH = 0;
let headerH = 0;

class FolderTree extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      collapsed: {},
      modalOpen: false,
      optionsPopUp: {
        open: false
      }
    };

    this.toggle = this.toggle.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleShareClick = this.handleShareClick.bind(this);
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleModal() {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  }

  increaseHeight = el => {
    if (!el) return;

    const tree = el.querySelector('.folder-tree-wrap');
    const open = tree.querySelector('ul .btn-open');
    if (open) {
      el.classList.add('expanded');
    } else {
      el.classList.remove('expanded');
    }

    if (el.clientWidth < el.scrollWidth) {
      el.classList.add('has-scrollbar');
    } else {
      el.classList.remove('has-scrollbar');
    }
  };

  handleShareClick(e, s, expand) {
    e.preventDefault();

    if (e.type === 'mousedown') {
      if (e.target.getAttribute('data-collapse')) {
        let id = s.id;

        if (!this.props.modal) {
          this.props.setCollapseFolder(s.id);
        }

        const parent = e.target.closest('.shares-wrapper');

        let collapsed = Object.assign({}, this.state.collapsed);
        collapsed[id] = collapsed[id] ? !collapsed[id] : true;
        this.setState({ collapsed: collapsed });

        if (collapsed[id] == true) {
          let params = {
            team_id: this.props.active_team.id,
            folder_id: id
          };

          this.props.fetchFolders(params).then(() => {
            this.increaseHeight(parent);
          });
        } else {
          setTimeout(() => {
            this.increaseHeight(parent);
          }, 200);
        }
      } else {
        this.props.handleShareClick(s, e);
      }
    } else if (e.type === 'contextmenu') {
      if (this.props.rightClick) {
        let d = {
          current: s,
          last: { ...s, view: this.props.modal ? 'modal' : 'sidebar' },
          position: { left: e.clientX + 'px', top: e.clientY + 'px' }
        };

        if (e.clientY + 290 - headerH > sidebarH) {
          d.position = { left: e.clientX + 'px', top: e.clientY - 290 + 'px' };
        }

        this.props.setClickActiveFolder(d);
      }
    }
  }

  componentDidMount() {
    if (this.props.modal) {
      this.setState({ collapsed: Object.assign({}, this.props.collapsed) });
    }

    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebarH = sidebar.clientHeight;

    const header = document.getElementById('header');
    if (header) headerH = header.clientHeight;
  }

  render() {
    const { root_folders, folders, active, active_clicked, rightClick } = this.props;

    return (
      <div
        className={`folder-tree-wrap w-100 ${
          this.props.modal ? ' prevent-modal-body-overflow' : ''
        }`}
      >
        <RootFolder
          active={this.props.rootActive}
          open={this.props.rootOpen}
          onClick={this.props.handleRootClick}
        />

        <Collapse isOpen={this.props.rootOpen}>
          <ul className={`list-unstyled shares-list folder-tree mb-0`}>
            {root_folders.map(s => {
              return (
                <FolderTreeItem
                  key={s.id}
                  folder={s}
                  collapsed={this.props.modal ? this.state.collapsed : this.props.collapsed}
                  active={active}
                  active_clicked_folder_id={
                    active_clicked.current &&
                    active_clicked.current.id &&
                    !active_clicked.current.thumb
                      ? active_clicked.current.id
                      : null
                  }
                  handleShareClick={this.handleShareClick}
                  folders={folders}
                  rightClick={rightClick}
                />
              );
            })}
          </ul>
        </Collapse>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    root_folders: orderBy(
      state.folders.list.filter(f => f.root),
      [s => s.title.toLowerCase()],
      ['asc']
    ),
    folders: state.folders.list.map(f => {
      return { ...f, path: getFolderFullPath(f, state) };
    }),
    active_clicked: state.folders.click_active,
    active_team: state.teams.active,
    collapsed: state.folders.collapsed
  };
}

export default connect(
  mapStateToProps,
  {
    setClickActiveFolder,
    setCollapseFolder,
    fetchFolders
  }
)(FolderTree);
