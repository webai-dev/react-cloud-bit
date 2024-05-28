import React, { Component } from 'react';
import { format } from 'utils/dates';
import { debounce } from 'lodash';
import { apiService } from 'utils/api';
import { connect } from 'react-redux';
import {
  fetchFileVersions,
  setKeepForever,
  editFileVersion,
  deleteFileVersion
} from 'views/files/_actions';

import { UncontrolledTooltip } from 'reactstrap';

import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import Actions from './Actions';
import Modal from './Modal';

import SvgRender from 'components/general/SvgRender';
import loader from 'assets/svg/general/loader.svg';

class Versions extends Component {
  state = {
    loading: false,
    modal: null
  };

  componentDidMount() {
    this.fetchVersions();
  }
  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) this.fetchVersions();
  }

  fetchVersions = (withLoading = true) => {
    this.setState({ loading: withLoading });
    return this.props.fetchFileVersions({ id: this.props.id }).then(data => {
      this.setState({ loading: false });
    });
  };

  toggleKeepForever = debounce(() => {
    this.props
      .setKeepForever({ id: this.props.id, keep: !this.props.keepForever })
      .then(() => this.fetchVersions(false));
  }, 300);

  action = id => actionType => {
    switch (actionType) {
      case 'rename':
        this.openModal(id);
        break;
      case 'download':
        this.download(id);
        break;
      case 'keep-forever':
        this.toggleKeepVersion(id);
        break;
      case 'delete':
        this.delete(id);
        break;
      default:
        break;
    }
  };

  openModal = id => this.setState({ modal: id });
  closeModal = id => this.setState({ modal: null });

  renameVersion = id => newName =>
    this.props.editFileVersion({
      fileId: this.props.id,
      versionId: id,
      name: newName
    });

  toggleKeepVersion = id =>
    this.props.editFileVersion({
      fileId: this.props.id,
      versionId: id,
      keep: !this.props.versions.find(v => v.id === id).keep
    });

  download = id =>
    apiService.get(`/files/${this.props.id}/versions/${id}`).then(res => {
      const { url } = res.data;
      let a = document.createElement('a');
      a.href = url;
      a.download = this.props.versions.find(v => v.id === id).filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function() {
        document.body.removeChild(a);
      }, 0);
    });

  delete = id =>
    this.props.deleteFileVersion({
      fileId: this.props.id,
      versionId: id
    });

  render() {
    const { versions, keepForever } = this.props;
    const { loading } = this.state;

    return (
      <div className="mb-2">
        <TitleRow>
          <TitleText>Versions</TitleText>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className={`btn btn-select ${keepForever ? 'active' : ''} mr-1`}
              onClick={this.toggleKeepForever}
            />
            <span id="keep-all-check" style={{ color: variables.primary }}>
              Keep all forever
            </span>
            <UncontrolledTooltip
              target="keep-all-check"
              innerClassName={TooltipStyle}
              className={css`
                opacity: 1 !important;
              `}
            >
              <div style={{ textAlign: 'start' }}>Older file versions that are not</div>
              <div style={{ textAlign: 'start' }}>marked as “Keep forever” are</div>
              <div style={{ textAlign: 'start' }}>automatically deleted after 1 month.</div>
            </UncontrolledTooltip>
          </div>
        </TitleRow>
        {loading ? (
          <div className="d-flex aling-items-center justify-content-center m-4">
            <SvgRender path={loader} style={{ width: 48, height: 48 }} />
          </div>
        ) : (
          versions.map(({ id, versionName, fileName, date, uploader, keep }) => (
            <VersionContainer key={id}>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center ">
                  <div className="mr-2">{versionName}</div> {keep && <Dot />}
                </div>
                <Actions keep={keep} action={this.action(id)} />
              </div>
              <Row>
                <Category>Uploader</Category>
                {uploader}
              </Row>
              <Row>
                <Category>Name</Category>
                {fileName}
              </Row>
              <Row>
                <Category>Date</Category>
                {format(date)}
              </Row>
              <Modal
                isOpen={this.state.modal === id}
                initialValue={versionName}
                onConfirm={this.renameVersion(id)}
                onClose={this.closeModal}
              />
            </VersionContainer>
          ))
        )}
      </div>
    );
  }
}
export default connect(
  (state, props) => {
    const searchFiles = state.search.index ? state.search.index.files : [];
    const dashboardFiles = state.dashboard ? state.dashboard.files : [];
    const file = [
      ...state.files.list,
      ...state.shares.files,
      ...searchFiles,
      ...dashboardFiles
    ].find(item => item.id === props.id);

    return {
      keepForever: file.keep,
      versions: file.versions
        ? file.versions.map(version => {
            const uploaderUser = state.teammates.list.find(user => user.id === version.user_id);
            return {
              id: version.id,
              versionName: version.name,
              fileName: version.filename,
              date: version.created_at,
              keep: version.keep,
              uploader: uploaderUser ? uploaderUser.name : 'Unknown'
            };
          })
        : []
    };
  },
  { fetchFileVersions, setKeepForever, editFileVersion, deleteFileVersion }
)(Versions);

const TitleRow = styled('div')`
  padding-left: ${variables.size32};
  padding-right: ${variables.size16};
  padding-bottom: ${variables.size8};
  padding-top: ${variables.size16};

  display: flex;
  align-items: center;
  justify-content: space-between;

  font-size: ${variables.size14};

  border-bottom: 1px solid ${variables.iconInactive};
`;
const TitleText = styled('div')`
  font-weight: 600;
  font-size: ${variables.size16};
`;

const Category = styled('div')`
  color: ${variables.secondary};
  width: ${variables.size80};
`;

const Row = styled('div')`
  display: flex;
  font-size: ${variables.size14};
  margin-bottom: ${variables.size8};
  &:last-child {
    margin-bottom: 0;
  }
`;

const Dot = styled('div')`
  width: ${variables.size8};
  height: ${variables.size8};
  border-radius: 50%;
  background-color: ${variables.blue};
`;

const VersionContainer = styled('div')`
  padding: ${variables.size8} ${variables.size32};
  padding-right: ${variables.size8};
  padding-bottom: ${variables.size12};
  border-bottom: 1px solid ${variables.iconInactive};
`;

const TooltipStyle = css`
  width: 210px;
  max-width: 210px;
  font-size: ${variables.size12};
  padding: 0.25rem 0.75rem;
  background-color: ${variables.head};
  color: white;
  box-shadow: 4px 6px 32px -3px #9e9e9e;

  + .arrow:before {
    border-top-color: ${variables.head};
    border-bottom-color: ${variables.head};
  }
`;
