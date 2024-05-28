import React, { Component } from 'react';

import { connect } from 'react-redux';
import { fetchFile } from 'views/files/_actions';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import SvgRender from 'components/general/SvgRender';
import loader from 'assets/svg/general/loader.svg';

class ImagePreview extends Component {
  state = { url: null, loading: true };

  componentDidMount() {
    this.fetchFile();
  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.id !== this.props.id ||
      prevProps.preview_url !== this.props.preview_url ||
      (prevProps.versions &&
        this.props.versions &&
        prevProps.versions.length !== this.props.versions.length)
    )
      this.fetchFile();
  }

  fetchFile() {
    this.setState({ loading: true, url: null });
    this.props
      .fetchFile({
        team_id: this.props.team_id,
        file_id: this.props.id
      })
      .then(data => data && this.setState({ url: data.url }))
      .finally(() => this.setState({ loading: false }));
  }

  render() {
    const { loading, url } = this.state;

    return (
      <Image src={url}>
        {loading && <SvgRender path={loader} style={{ width: 48, height: 48 }} />}
      </Image>
    );
  }
}

export default connect(
  state => ({ team_id: state.teams.active.id }),
  { fetchFile }
)(ImagePreview);

const Image = styled('div')`
  width: 100%;
  height: 224px;
  background-color: #fafafa;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;

  display: flex;
  justify-content: center;
  align-items: center;
`;
