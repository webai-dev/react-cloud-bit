import Input from 'components/inputs';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Scrollbar } from 'utils/styles/scrollbar';
import FolderTree from 'views/folders/FolderTree';
import { createFolder } from 'views/folders/_actions';
import Container from './MediaContainer';

class CreateFolder extends Component {
  state = {
    selectedFolder: this.props.active_folder,
    rootSelected: !this.props.active_folder,
    name: '',
    nameError: false
  };

  selectFolder = id => this.setState({ selectedFolder: id, rootSelected: false });
  selectRoot = () => this.setState({ selectedFolder: null, rootSelected: true });
  changeName = e => this.setState({ name: e.target.value });

  onCreateFolder = () => {
    if (!this.state.name) this.setState({ nameError: true });
    else {
      this.props
        .createFolder({
          folder_id: this.state.selectedFolder,
          team_id: this.props.active_team_id,
          title: this.state.name
        })
        .then(this.props.close);
    }
  };

  render() {
    return (
      <Container>
        <div
          className="btn dropdown-item btn-dropdown-icon btn-arrow-back-icon border-bottom"
          onClick={() => this.props.previous('menu')}
        >
          Back
        </div>
        <div className="pt-2 pr-3 pl-3 pb-5">
          <div className="d-flex align-items-center mb-2">
            <div className="mr-3">Folder Name</div>
            <Input
              value={this.state.name}
              onChange={this.changeName}
              classNameWrapper="mb-0 flex-grow-1"
              touched
              error={this.state.nameError ? 'Title is a required field' : null}
            />
          </div>
          <div className={`folders-tree-dropdown ${Scrollbar}`}>
            <FolderTree
              active={this.state.selectedFolder}
              rootActive={this.state.rootSelected}
              rightClick={false}
              rootOpen={true}
              modal={true}
              handleRootClick={this.selectRoot}
              handleShareClick={({ id }) => this.selectFolder(id)}
            />
          </div>

          <div className="col-12 text-right ">
            <button
              type="submit"
              className="btn btn-success mt-2 pr-5 pl-5"
              onClick={this.onCreateFolder}
            >
              Create
            </button>
            <button
              type="button"
              className="btn btn-remove-link mt-2 ml-2"
              onClick={this.props.close}
            >
              Cancel
            </button>
          </div>
        </div>
      </Container>
    );
  }
}
export default connect(
  state => ({
    active_folder: state.folders.active,
    active_team_id: state.teams.active.id
  }),
  { createFolder }
)(CreateFolder);
