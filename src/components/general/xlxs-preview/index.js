import React, { Component } from 'react';
import XLSX from 'xlsx';
import OutTable from './OutTable';

class XLXSPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      rows: [],
      cols: []
    };
  }

  httpGetAsync = url => {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('get', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
          resolve(xhr.response);
        } else {
          reject(status);
        }
      };
      xhr.send();
    });
  };

  renderExcel = async () => {
    const { file, onLoad, onError } = this.props;
    if (!file) return;
    var remoteCode = await this.httpGetAsync(file);
    this.excelRenderer(remoteCode).then(resp => {
      this.setState({
        dataLoaded: true,
        cols: resp.cols,
        rows: resp.rows
      });
      onLoad();
    });
  };

  excelRenderer = (file, callback) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      var rABS = !!reader.readAsBinaryString;
      reader.onload = e => {
        /* Parse data */
        var bstr = e.target.result;
        var wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });

        /* Get first worksheet */
        var wsname = wb.SheetNames[0];
        var ws = wb.Sheets[wsname];

        /* Convert array of arrays */
        var json = XLSX.utils.sheet_to_json(ws, { header: 1 });
        var cols = this.make_cols(ws['!ref']);
        var data = { rows: json, cols: cols };
        resolve(data);
      };
      if (file && rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
    });
  };

  make_cols = refstr => {
    var o = [],
      C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) {
      o[i] = { name: XLSX.utils.encode_col(i), key: i };
    }
    return o;
  };

  componentDidMount() {
    this.renderExcel();
  }
  render() {
    return (
      <OutTable
        className={this.props.className || ''}
        rows={this.state.rows}
        cols={this.state.cols}
      />
    );
  }
}

export default XLXSPreview;
