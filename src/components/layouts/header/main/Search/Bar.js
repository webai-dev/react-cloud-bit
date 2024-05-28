import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { css } from 'react-emotion';
import { MentionsInput, Mention } from 'react-mentions';
import variables from 'assets/sass/partials/_exports.scss';
import OwnerCard from './OwnerCard';

import types from './typeOptions';
import TypeCard from './TypeCard';

const regex = {
  tag: /#[^ ]{1}[^ ]*[ ]{1}/
};

class SearchBar extends Component {
  state = { isFocused: false };

  handleChange = e => {
    let { value } = e.target;
    value = value.replace(regex.tag, tag => {
      const tagContents = tag.slice(1, tag.length - 1);
      return `{{tag, ${tagContents}, ${tagContents}}} `;
    });
    this.props.onChange(value);
  };

  handleFocus = e => {
    this.setState({ isFocused: true });
    this.props.onFocus();
  };
  handleBlur = e => {
    this.setState({ isFocused: false });
  };

  getTeammateOptions = () =>
    this.props.teammates
      ? this.props.teammates.map(mate => ({ ...mate, id: mate.id, display: mate.name }))
      : [];

  getTypeOptions = () => types.map(type => ({ ...type, id: type.id, display: type.label }));

  renderDisplay = (_, display, type) => {
    switch (type) {
      case 'tag':
        return ` #${display} `;
      case 'owner':
        return ` @${display} `;
      case 'type':
        return ` type:${display} `;
      default:
        return ` ${display} `;
    }
  };

  componentDidUpdate(prevProps) {
    // Filthy imperative code
    // for changing color on type mentions base on specific type
    // necessary evil
    if (prevProps.value !== this.props.value) {
      const elements = document.getElementsByClassName('type');
      Array.from(elements).forEach(e => {
        e.style.backgroundColor = typeColors[e.innerHTML];
      });
    }
  }

  render() {
    return (
      <div className="form-group-wrapper search-wrapper mb-0 row form-group">
        <div className="col-sm-12">
          <div
            className={`form-control d-flex flex-column justify-content-center ${
              this.state.isFocused ? focus : ''
            }`}
          >
            <MentionsInput
              value={this.props.value}
              markup={'{{__type__, __id__, __display__}}'}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              style={customStyles}
              displayTransform={this.renderDisplay}
              singleLine
            >
              <Mention
                trigger="@"
                type="owner"
                data={this.getTeammateOptions()}
                className={`${mentionClassName} owner`}
                renderSuggestion={suggestion => <OwnerCard {...suggestion} />}
                appendSpaceOnAdd
              />
              <Mention
                trigger="type:"
                type="type"
                data={this.getTypeOptions()}
                className={`${mentionClassName} type`}
                renderSuggestion={suggestion => <TypeCard horizontal {...suggestion} />}
                appendSpaceOnAdd
              />
              <Mention
                trigger="#"
                type="tag"
                data={[]}
                className={`${mentionClassName} tag`}
                renderSuggestion={suggestion => suggestion.value}
                appendSpaceOnAdd
              />
            </MentionsInput>
          </div>
        </div>
      </div>
    );
  }
}
export default SearchBar;

const focus = css`
  border: 1px solid ${variables.primary}!important;
`;

const mentionClassName = css`
  font-weight: 400 !important;
  border-radius: 3px;
  color: white;
  &.owner {
    background-color: #ecc526;
  }
  &.tag {
    background-color: #2d22b5;
  }
  &.type {
    background-color: #586777;
  }
`;

const typeColors = {
  ' type:Bits ': '#3c4858',
  ' type:Folders ': '#85b7d9',
  ' type:Images ': '#586777',
  ' type:Text ': '#3396F1',
  ' type:Pdfs ': '#DB4437',
  ' type:Videos ': '#AC79F2',
  ' type:Spreadsheets ': '#22B573',
  ' type:Files ': '#ff5a5f'
};

const customStyles = {
  control: {
    width: '100%',
    height: '100%',
    fontSize: 14
  },

  highlighter: {
    zIndex: 2,
    pointerEvents: 'none',
    cursor: 'text',
    outline: 0,
    border: 0,
    fontWeight: '300!important'
  },

  input: {
    outline: 0,
    border: 0
  },

  suggestions: {
    zIndex: 5000,
    list: {
      backgroundColor: 'white',
      fontSize: 14,
      boxShadow: '4px 6px 32px -3px #9e9e9e',
      borderRadius: '3px',
      padding: variables.size16,
      paddingBottom: 0,
      maxHeight: 500,
      overflowY: 'scroll'
    },

    item: {
      paddingBottom: variables.size16,
      '&focused': {
        color: variables.primary
      }
    }
  }
};
