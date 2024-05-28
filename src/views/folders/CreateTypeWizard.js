import React, { Component } from 'react';

import { connect } from 'react-redux';
import Header from 'components/layouts/header';
import FolderWizard from 'views/folders/FolderWizard';
import BitWizard from 'views/bits/BitWizard';
import { FormsBreakpointsClasses } from 'utils/media';

class CreateTypeWizard extends Component {
  constructor(props) {
    super(props);

    const urlType = window.location.search.slice(1);
    let type = 'folder';

    if (props.match.params.bit_id) {
      type = 'bit';
    } else {
      if (urlType) {
        const matches = urlType.split('=');
        if (matches && matches[1]) {
          type = matches[1] === 'bit' ? 'bit' : 'folder';
        }
      }
    }

    this.state = {
      selectedType: type
    };
  }

  onFieldChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.match.params.bit_id && this.state.selectedType !== '') {
      const urlType = window.location.search.slice(1);
      let type = 'folder';

      if (urlType) {
        const matches = urlType.split('=');
        if (matches && matches[1]) {
          type = matches[1] === 'bit' ? 'bit' : 'folder';
        }
      }
      this.setState({ selectedType: type });
    }
  }

  render() {
    return (
      <div className="content-inner-wrapper">
        <Header
          breadcrumbs={this.props.match.params.bit_id ? false : true}
          title={`${this.props.match.params.bit_id ? 'Edit bit' : null} `}
        />

        <div className="row">
          {!this.props.match.params.bit_id && !this.props.match.params.id ? (
            <div className={FormsBreakpointsClasses}>
              <FolderWizard history={this.props.history} />
            </div>
          ) : (
            <div className={FormsBreakpointsClasses}>
              {this.state.selectedType === 'folder' ? (
                <FolderWizard history={this.props.history} />
              ) : this.state.selectedType === 'bit' ? (
                <BitWizard history={this.props.history} bit_id={this.props.match.params.bit_id} />
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {};
}

export default connect(
  mapStateToProps,
  {}
)(CreateTypeWizard);
