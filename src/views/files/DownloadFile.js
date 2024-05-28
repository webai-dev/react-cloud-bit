import React, { Component } from 'react';

import { apiService } from 'utils/api';

class DownloadFile extends Component {
  componentDidMount() {
    const token = this.props.match.params.token;
    apiService.get(`files/public/${token}`).then(resp => {
      window.location = resp.data.url;
    });
  }
  render() {
    return null;
  }
}

export default DownloadFile;
