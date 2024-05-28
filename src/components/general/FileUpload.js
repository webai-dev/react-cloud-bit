import React, { Component } from 'react';
import { Label } from 'reactstrap';
import Dropzone from 'react-dropzone';
import styled, { css } from 'react-emotion';

import SvgRender from 'components/general/SvgRender';

import { imageUpload } from 'utils/upload';
import variables from 'assets/sass/partials/_exports.scss';

import gallery from 'assets/svg/general/gallery.svg';
import loader from 'assets/svg/general/loader.svg';

export class FileUpload extends Component {
  state = { file: [], uploadedFileURL: '', uploading: false };

  componentWillUnmount = () => {
    window.URL.revokeObjectURL(this.state.file.preview);
  };

  onDrop = files => {
    this.handleImageUpload(files[0]);
  };

  async handleImageUpload(file) {
    this.setState({ uploading: true });
    const response = await imageUpload(file);

    if (response.status === 200) {
      this.setState({
        file: file
      });
    }
    if (this.props.onChange) {
      this.props.onChange(this.props.name, response.data.urls[0]);
    }

    this.setState({ uploading: false });
  }

  removeImage = () => {
    window.URL.revokeObjectURL(this.state.file.preview);
    this.setState({
      file: []
    });
  };

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.value && nextProps.value !== '' && this.state.uploadedFileURL === '') {
      this.setState({
        uploadedFileURL: nextProps.value,
        file: { preview: nextProps.value }
      });
    } else if (nextProps.value === '' && this.state.uploadedFileURL !== '') {
      this.setState({ uploadedFileURL: '', file: {} });
    }
  }

  componentWillMount() {
    if (this.props.value && this.props.value !== '' && this.state.uploadedFileURL === '') {
      this.setState({
        uploadedFileURL: this.props.value,
        file: { preview: this.props.value }
      });
    }
  }

  render() {
    const { file } = this.state;
    return (
      <div className={'form-group-wrapper form-group'}>
        <Label />
        <Dropzone
          onDrop={this.onDrop}
          className={`${defaultClassName} ${file.preview ? 'selected' : ''}`}
          activeClassName={activeClassName}
          disabledClassName={disabledClassName}
          multiple={false}
          disableClick={file.preview ? true : false}
        >
          <SvgRender
            className="icon"
            style={{ height: this.state.uploading ? 48 : 24 }}
            path={this.state.uploading ? loader : gallery}
          />
          <span className="pl-2">{!this.state.uploading ? 'Upload photo here' : 'Uploading'}</span>

          {file.preview && (
            <ImagePreview onClick={this.removeImage}>
              <img alt="new profile pic preview" src={file.preview} />
              <button type="button" className="btn btn-empty close-icon">
                Remove photo
              </button>
            </ImagePreview>
          )}
        </Dropzone>
      </div>
    );
  }
}

export default FileUpload;

const defaultClassName = css`
  width: 100%;
  color: ${variables.darkBlue};
  border: 2px dashed ${variables.linesGray};
  border-radius: 3px;
  height: ${variables.size80};
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: ${variables.fontFamilyBase};
  font-size: ${variables.size12};
  font-weight: 400;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  .icon {
    height: ${variables.size24};
    fill: ${variables.darkBlue};
    transition: all 0.3s ease;
  }
  :hover {
    border-style: solid;
    border-color: ${variables.darkBlue};
  }
  &.selected:hover {
    border-color: ${variables.red};
  }
`;
const activeClassName = css`
  border-color: ${variables.green};
  border-style: solid;
  color: ${variables.green};
  .icon {
    fill: ${variables.green};
  }
`;

const disabledClassName = css`
  border-color: ${variables.red};
  color: ${variables.red};
  .icon {
    fill: ${variables.red};
  }
`;

const ImagePreview = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: ${variables.size4};
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    position: absolute;
    left: ${variables.size4};
    top: ${variables.size4};
    height: 100%;
    max-width: ${variables.size80};
    object-fit: cover;
    height: calc(100% - ${variables.size8});
  }
  button {
    color: ${variables.red};
    padding-left: ${variables.size24};
  }
`;
