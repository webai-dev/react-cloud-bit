import variables from 'assets/sass/partials/_exports.scss';
import download from 'assets/svg/actions/download.svg';
import loader from 'assets/svg/general/loader.svg';
import SvgRender from 'components/general/SvgRender';
import React, { Component, Fragment } from 'react';
import styled, { css } from 'react-emotion';
import { fileType, icon } from 'utils/files';
import { Player } from 'video-react';
import { Document, Page } from 'react-pdf';
import XLXSPreview from 'components/general/xlxs-preview';
class PreviewModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: null,
      imageStatus: '',
      fileType: null,
      title: '',
      item: null,
      numPages: null,
      pageNumber: 1
    };
  }

  onDocumentLoadSuccess = document => {
    const { numPages } = document;
    this.setState({
      imageStatus: 'loaded',
      numPages,
      pageNumber: 1
    });
  };

  changePage = offset =>
    this.setState(prevState => ({
      pageNumber: prevState.pageNumber + offset
    }));

  previousPage = () => this.changePage(-1);

  nextPage = () => this.changePage(1);

  handleLoaded(e) {
    this.setState({ imageStatus: 'loaded' });
  }

  handleImageErrored() {
    this.setState({ imageStatus: 'failed' });
  }

  changeActive(e, direction) {
    if (direction === 'prev') {
      if (this.state.activeIndex - 1 !== -1) {
        this.fetchActive(this.props.files[this.state.activeIndex - 1]);
      }
    } else {
      if (this.state.activeIndex + 1 !== this.props.files.length) {
        this.fetchActive(this.props.files[this.state.activeIndex + 1]);
      }
    }
  }

  fetchActive(file) {
    this.setState({
      imageStatus: 'loading',
      fileType: fileType(file.mime_type, file.extension).type,
      activeIndex: this.props.files.findIndex(f => f.id === file.id),
      url: null
    });

    this.props.actions
      .fetchFile({
        team_id: this.props.active_team.id,
        file_id: file.id
      })
      .then(data => {
        if (data) {
          this.setState({
            url: data.url,
            title: data.title,
            item: this.props.files.find(f => f.id === file.id)
          });
        }
      });
  }

  componentDidMount() {
    this.fetchActive(this.props.item);

    document.addEventListener('keydown', e => {
      if (e.keyCode == 37) {
        this.changeActive(e, 'prev');
      } else if (e.keyCode == 39) {
        this.changeActive(e, 'next');
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', () => {});
  }

  renderPreview() {
    const { numPages, pageNumber } = this.state;
    if (this.state.fileType.match('video.*')) {
      return (
        <div className="video-container w-50">
          <Player>
            <source src={this.state.url} />
          </Player>
        </div>
      );
    } else if (this.state.fileType.match('pdf')) {
      return (
        <div className="video-container w-75 d-flex flex-sm-column justify-content-center h-75 align-items-center">
          <div className="pdf-document">
            <Document file={this.state.url} onLoadSuccess={this.onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
          <div className="pdf-document_pagination mt-2">
            <p>
              Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
            </p>
            <button
              type="button"
              className="btn btn-primary pl-4 pr-4 mr-2"
              disabled={pageNumber <= 1}
              onClick={this.previousPage}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-primary pl-4 pr-4"
              disabled={pageNumber >= numPages}
              onClick={this.nextPage}
            >
              Next
            </button>
          </div>
        </div>
      );
    } else if (this.state.fileType.match('spreadsheet')) {
      return (
        <XLXSPreview
          className={'w-75'}
          file={this.state.url}
          onLoad={this.handleLoaded.bind(this)}
        />
      );
    } else {
      return (
        <img
          src={this.state.url}
          className={`${ImageStyle}`}
          onLoad={this.handleLoaded.bind(this)}
          onError={this.handleImageErrored.bind(this)}
        />
      );
    }
  }

  render() {
    return (
      <Fragment>
        <TitleWrap>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className={`btn btn-empty p-0 pr-2 ${PreviewDownload}`}
              onClick={e => this.props.actions.downloadFile(e, this.state.item)}
            >
              <SvgRender className="icon" path={download} style={{ height: 16 }} />
            </button>
            <SvgRender
              className="icon mr-2"
              path={icon(this.props.item.mime_type, this.props.item.extension)}
              style={{ height: 24 }}
            />

            {this.state.title}
          </div>
          <div className={BackButton}>
            <button className="btn" type="button" onClick={e => this.props.toggle()}>
              <span>&#10005;</span>
            </button>
          </div>
        </TitleWrap>
        <div className="modal-body" id="modal-body">
          <PreviewWrap className={this.state.imageStatus}>
            {this.state.url && this.state.fileType && this.renderPreview()}

            {this.state.imageStatus === 'failed' && (
              <LoadFail>
                <div>No preview available.</div>
                <button
                  className="btn btn-primary pl-4 pr-4 mt-2"
                  onClick={e => this.props.actions.downloadFile(e, this.state.item)}
                >
                  Download
                </button>
              </LoadFail>
            )}
          </PreviewWrap>

          {this.state.activeIndex !== 0 && (
            <Prev className={navPreview}>
              <button className="btn" type="button" onClick={e => this.changeActive(e, 'prev')}>
                <span>&lsaquo;</span>
              </button>
            </Prev>
          )}
          {this.state.activeIndex + 1 !== this.props.files.length && (
            <Next className={navPreview}>
              <button className="btn" type="button" onClick={e => this.changeActive(e, 'next')}>
                <span>&rsaquo;</span>
              </button>
            </Next>
          )}
        </div>
      </Fragment>
    );
  }
}

export default PreviewModal;

const ImageStyle = css`
  max-height: 100%;
  max-width: 100%;
  opacity: 0;
`;

const PreviewWrap = styled('div')`
  position: absolute;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  &.loaded {
    > img {
      opacity: 1;
    }
  }

  &.loading {
    &:before {
      content: '';
      width: 64px;
      height: 64px;
      position: absolute;
      background: url(${loader});
    }
  }

  .pdf-document {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 12px);
    .page-count {
      color: ${variables.head};
      bottom: 2px;
      font-size: ${variables.size12};
    }
    .annotationLayer {
      display: none;
    }
  }
  .pdf-document_pagination {
    text-align: center;
  }
`;

const LoadFail = styled('div')`
  font-size: ${variables.size16};
  text-align: center;
`;

const navPreview = css`
  width: 40px;
  height: 40px;
  position: absolute;

  > .btn {
    padding: 0;
    height: 48px;
    width: 48px;
    border-radius: 100%;
    background: rgba(0, 0, 0, 0.75);
    -moz-transition: background 0.2s, opacity 0.34s, transform 0.34s cubic-bezier(0.4, 0, 0.2, 1);
    transition: background 0.2s, opacity 0.34s, transform 0.34s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: ${variables.primary};
    }

    > span {
      color: #fff;
      font-size: ${variables.size40};
      display: inline-block;
      margin-top: 2px;
    }
  }
`;

const BackButton = css`
  right: 1.5rem;
  top: 0.75rem;
  width: 30px;
  height: 30px;
  position: absolute;

  > .btn {
    padding: 0;
    height: 30px;
    width: 30px;
    border-radius: 100%;
    background: rgba(0, 0, 0, 0.75);
    -moz-transition: background 0.2s, opacity 0.34s, transform 0.34s cubic-bezier(0.4, 0, 0.2, 1);
    transition: background 0.2s, opacity 0.34s, transform 0.34s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: ${variables.primary};
    }

    > span {
      color: #fff;
      font-size: ${variables.$size16};
      display: inline-block;
      margin-top: 2px;
    }
  }
`;

const Prev = styled('div')`
  left: ${variables.size24};
`;

const Next = styled('div')`
  right: ${variables.size24};
`;

const TitleWrap = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: ${variables.size14};
  padding: ${variables.size16} ${variables.size24};
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, transparent 100%);
  height: 56px;
  border: none;
`;

const PreviewBack = css`
  .icon * {
    fill: #fff;
  }
`;

const PreviewDownload = css`
  fill: #fff;
`;
