import React, { Component } from 'react';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

class OutTable extends Component {
  render() {
    return (
      <TableWraper className={`table-responsive bg-white  ${this.props.className || ''}`}>
        <table className="table table-striped excel_table">
          <thead>
            <tr>
              {this.props.cols.map(c => (
                <th key={c.key}>{c.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {this.props.rows.map((r, i) => (
              <tr key={i}>
                {this.props.cols.map(c => (
                  <td key={c.key}>{r[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </TableWraper>
    );
  }
}

export default OutTable;

const TableWraper = styled('div')`
  max-height: 75%;
  .excel_table {
    padding: 10px;
    color: ${variables.darkBlue};
    td,
    th {
      padding: 0 ${variables.size8};
      border: 1px solid #dee2e6;
      border-width: 0px 1px 1px 0px;
    }
  }
`;
