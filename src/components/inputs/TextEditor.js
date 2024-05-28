import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import { FormGroup, Label, Col } from 'reactstrap';
import PropTypes from 'prop-types';

import Error from './Error';

import variables from 'assets/sass/partials/_exports.scss';

require('assets/packages/redactor/redactor.js');
require('assets/packages/redactor/plugins/alignment/alignment.js');
require('assets/packages/redactor/plugins/counter/counter.js');
const $R = window.Redactor;

export class TextEditor extends Component {
  static defaultProps = { hideToolbar: false };

  componentDidMount() {
    $R(`#${this.props.id}`, {
      buttons: [
        'html',
        'format',
        'bold',
        'italic',
        'deleted',
        'underline',
        'alignment',
        'ul',
        'ol',
        'link',
        'redo',
        'undo'
      ],
      plugins: ['alignment', 'counter'],
      minHeight: '148px',
      callbacks: {
        keyup: e => {
          this.props.onChange(this.props.name, e.target.innerHTML);
        }
      },
      linkTarget: '_blank',
      pasteLinkTarget: '_blank',
      linkSize: '100%'
    });

    if (this.props.value) {
      $R(`#${this.props.id}`, 'source.setCode', this.props.value);
    }
  }

  render() {
    const { name, label, labelPosition, touched, error, disabled } = this.props;

    return (
      <FormGroup
        className={`form-group-wrapper ${FormGroupStyle} ${labelPosition ? labelPosition : ''}`}
        row
      >
        {label && (
          <Label className="mb-0" sm={12}>
            <LabelText touched={touched} error={error} disabled={disabled}>
              {label}
            </LabelText>
          </Label>
        )}
        <Col sm={12}>
          <textarea
            className="editor-content form-control"
            name={name}
            rows="6"
            id={this.props.id}
          />
          <Error touched={touched} error={error} />
        </Col>
      </FormGroup>
    );
  }
}

export default TextEditor;

TextEditor.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string
};

const FormGroupStyle = css`
  align-items: flex-start !important;
`;

const LabelText = styled('span')`
  color: ${props =>
    props.error && props.touched ? variables.red : props.disabled ? variables.disabled : 'inherit'};
`;
