import React, { Component } from 'react';
import { connect } from 'react-redux';

import { css } from 'react-emotion';
import { Scrollbar } from 'utils/styles/scrollbar';
import variables from 'assets/sass/partials/_exports.scss';

import FolderTree from 'views/folders/FolderTree';
import Container from './MediaContainer';

class SelectBitsFolder extends Component {
  state = {
    selectedFolder: this.props.active_folder,
    rootSelected: !this.props.active_folder
  };

  selectFolder = id => this.setState({ selectedFolder: id, rootSelected: false });
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
            Select where you want to place your new bit.
          </div>
          <div className={`folders-tree-dropdown ${Scrollbar}`}>
            <FolderTree
              active={this.state.selectedFolder}
              rootActive={this.state.rootSelected}
              rightClick={false}
              rootOpen={true}
              modal={true}
              handleRootClick={() => this.selectFolder(null)}
              handleShareClick={({ id }) => this.selectFolder(id)}
            />
          </div>

          <div className="col-12 text-right ">
            <button
              type="submit"
              className={`btn btn-success mt-2 pr-5 pl-5 ${
                !this.state.selectedFolder ? disabled : ''
              }`}
              onClick={() => {
                if (!this.state.selectedFolder) return;
                this.props.onSelect(this.state.selectedFolder);
                this.props.next('bit-2');
              }}
            >
              Continue
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
export default connect(state => ({
  active_folder: state.folders.active,
  active_team_id: state.teams.active.id
}))(SelectBitsFolder);

const disabled = css`
  cursor: default !important;
  color: ${variables.secondary} !important;
  &:hover : {
    background: white !important;
  }
`;
