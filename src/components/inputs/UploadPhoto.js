import React, { Component } from 'react';
import SvgRender from 'components/general/SvgRender';
import { FormGroup, Label, Col } from 'reactstrap';
import styled, { css } from 'react-emotion';

import Error from './Error';
import { imageUpload } from 'utils/upload';
import variables from 'assets/sass/partials/_exports.scss';

import upload from 'assets/svg/actions/upload.svg';
import loader from 'assets/svg/general/loader.svg';

export class UploadField extends Component {
  constructor(props) {
    super(props);

    this.state = { avatarPath: null, uploading: false };
    this.handleAvatarSelection = this.handleAvatarSelection.bind(this);
    this.handleAvatarRemoval = this.handleAvatarRemoval.bind(this);
  }

  handleAvatarRemoval(e) {
    e.preventDefault();
    this.setState({ avatarPath: null });
    if (this.props.onChange) {
      this.props.onChange(this.props.name, '');
    }
  }

  async handleAvatarSelection(e) {
    let file = e.target.files[0];
    this.setState({ uploading: true });
    const response = await imageUpload(file);

    if (response.status === 200)
      this.setState({
        avatarPath: response.data.urls[0]
      });
    if (this.props.onChange) {
      this.props.onChange(this.props.name, response.data.urls[0]);
    }

    this.setState({ uploading: false });
  }

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.value && nextProps.value !== '') {
      this.setState({ avatarPath: nextProps.value });
    } else if (nextProps.value === '' && this.state.avatarPath !== null) {
      this.setState({ avatarPath: null });
    }
  }

  componentWillMount() {
    if (this.props.value && this.props.value !== '' && this.state.avatarPath === null) {
      this.setState({ avatarPath: this.props.value });
    }
  }

  render() {
    const { avatarPath } = this.state;
    const {
      label,
      id,
      touched,
      error,
      value,
      labelSize,
      labelPosition,
      large,
      classNameWrapper
    } = this.props;

    const modifierClass = classNameWrapper ? classNameWrapper : '';

    return (
      <FormGroup
        className={`form-group-wrapper ${modifierClass} ${labelSize === 'small' && LabelSmallText}`}
        row
      >
        {label && (
          <Label for={id} sm={labelPosition === 'side' ? 3 : 12}>
            <LabelText touched={touched} error={error}>
              {label}
            </LabelText>
          </Label>
        )}
        <Col sm={labelPosition === 'side' ? 9 : 12}>
          <UploadWrapper>
            <UploadPreview
              id="team-upload-wrapper"
              error={error}
              touched={touched}
              className={large && UploadPreviewLarge}
            >
              {avatarPath ? (
                <img alt="avatar" src={avatarPath} />
              ) : (
                <div className="w-100 upload-handler-wrapper">
                  <UploadHandler
                    type="file"
                    accept=".png, .jpg, .jpeg. .gif"
                    id="team-upload-handler"
                    value={value ? value : ''}
                    onChange={this.handleAvatarSelection}
                  />
                  <UploadLabel htmlFor="team-upload-handler">
                    <SvgRender
                      style={{ height: this.state.uploading ? 48 : 18 }}
                      path={this.state.uploading ? loader : upload}
                    />
                  </UploadLabel>
                </div>
              )}
            </UploadPreview>
            <UploadPrompt>
              {!avatarPath ? (
                <div>Upload logo here</div>
              ) : (
                <button
                  type="button"
                  className="btn btn-remove-link"
                  onClick={this.handleAvatarRemoval}
                >
                  X Remove
                </button>
              )}
              <div>JPG, GIF or PNG. Max size of 800K</div>
              <Error touched={touched} error={error} />
            </UploadPrompt>
          </UploadWrapper>
        </Col>
      </FormGroup>
    );
  }
}

export default UploadField;

const UploadWrapper = styled('div')`
  display: flex;
  align-items: center;
  img {
    width: 100%;
  }
`;

const UploadPreview = styled('div')`
  border-color: ${props => (props.error && props.touched ? variables.red : variables.linesGray)}
  height: 70px;
  min-width: 70px;
  max-width: 70px;
  display: flex;
  flex: 1 0 auto;
  margin-right: 1em;
  
  .upload-handler-wrapper {
    transition: all 0.3s ease;
    border-radius: 3px;
    border: 2px dashed #8492a6;
    
    &:hover {
      border: 2px solid #8492a6;
    }
  }
  
  img {object-fit: cover;}
`;

const UploadPreviewLarge = css`
  height: 80px;
  min-width: 80px;
  max-width: 80px;
  margin-right: 2rem;
`;

const UploadHandler = styled('input')`
  display: none;
  svg {
    fill: currentColor;
  }
`;

const UploadLabel = styled('label')`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
  cursor: pointer;
`;

const UploadPrompt = styled('div')`
  button {
    font-size: ${variables.size12};
  }
  > div {
    font-size: ${variables.size12};
    &:first-child {
      font-weight: 400;
    }
    &:nth-child(2) {
      margin-top: ${variables.size4};
      color: #8492a6;
    }
  }
`;

const LabelText = styled('span')`
  margin-bottom: 0;
  color: ${props => (props.error && props.touched ? variables.red : variables.head)};
`;

const LabelSmallText = css`
  font-size: ${variables.size14};
`;
