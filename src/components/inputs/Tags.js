import React, { PureComponent, Fragment } from 'react';
import { FormGroup, Label, Col } from 'reactstrap';
import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export class Tags extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { tags: [], input: '', increment: 0 };
    this.handleInput = this.handleInput.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleTagRemoval = this.handleTagRemoval.bind(this);
  }

  onChange() {
    if (this.props.onChange) {
      this.props.onChange(this.state.tags);
    }
  }

  handleTagRemoval = id => {
    const tags = this.state.tags.filter(x => x.id !== id);
    this.setState({ tags: tags }, () => {
      this.onChange();
    });
  };

  handleKeyPress = e => {
    /*
      TAB: 9
      RETURN: 8
      ENTER: 13
      COMMA: 188
    */
    const keycodes = [9, 13, 188];

    if (keycodes.includes(e.keyCode)) {
      e.preventDefault();
      this.handleAddition(e);
    } else if (e.keyCode === 8) {
      const { input, tags } = this.state;
      if (input === '' && tags.length > 0) {
        this.setState({ tags: tags.slice(0, -1) }, () => {
          this.onChange();
        });
      }
    }
  };

  handleInput = e => {
    this.setState({ input: e.target.value });
  };

  handleAddition = e => {
    const { input, tags, increment } = this.state;

    if (input.length === 0) {
      return false;
    }

    if (tags.find(x => x.name === input)) {
      this.setState({ input: '' });
      return false;
    }

    const obj = { name: input, id: increment };

    this.setState(
      {
        tags: [...tags, obj],
        increment: increment + 1,
        input: ''
      },
      () => {
        this.onChange();
      }
    );
  };

  setInputFocus() {
    document.getElementById(this.props.id).focus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.tags) {
      this.setState({ tags: nextProps.value });
    }
  }

  componentWillMount() {
    if (this.props.value) {
      this.setState({ tags: this.props.value });
    }
  }

  render() {
    const { label, labelPosition, id, placeholder } = this.props;
    const { tags, input } = this.state;

    return (
      <Fragment>
        <FormGroup className={`form-group-wrapper ${labelPosition ? labelPosition : ''}`} row>
          {label && (
            <Label className="mb-0" for={id} sm={12}>
              <LabelText>{label}</LabelText>
            </Label>
          )}
          <Col sm={12}>
            <InputWrapper
              onClick={() => {
                if (id) this.setInputFocus();
              }}
            >
              {tags.map(x => (
                <Tag key={x.id}>
                  {x.name}
                  <button
                    type="button"
                    className="close ml-2"
                    aria-label="Close"
                    onClick={() => this.handleTagRemoval(x.id)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </Tag>
              ))}
              <Input
                id={id}
                className="form-control"
                placeholder={placeholder ? placeholder : ''}
                value={input}
                onChange={this.handleInput}
                onKeyDown={this.handleKeyPress}
                onBlur={e => (e.target.value ? this.handleAddition(e) : null)}
              />
            </InputWrapper>
          </Col>
        </FormGroup>
      </Fragment>
    );
  }
}

export default Tags;

const InputWrapper = styled('div')`
  width: 100%;
  border: 1px solid ${variables.linesGray};
  border-radius: 3px;
  padding: ${variables.size4} ${variables.size16};
  line-height: 2;
  background: #fff;
`;

const Input = styled('input')`
  border: 0;
  box-shadow: none;
  display: inline;
  outline: none;
  padding: 0;
  min-width: 104px;
  line-height: 1.2;
  font-size: ${variables.size14};
  height: 32px;

  &:hover {
    box-shadow: none;
  }
`;

const Tag = styled('div')`
  align-items: center;
  background: ${variables.main};
  border-radius: 3px;
  color: #fff;
  display: inline-flex;
  font-weight: 400;
  font-size: ${variables.size12};
  margin-right: ${variables.size8};
  padding: 0 ${variables.size8};
  text-transform: uppercase;
  word-break: break-all;
  .close {
    color: #ffffff;
    cursor: pointer;
    text-shadow: none;
    opacity: 1;
    outline: none;
  }
`;

const LabelText = styled('span')`
  color: ${props =>
    props.error && props.touched
      ? variables.red
      : props.disabled
      ? variables.disabled
      : variables.head};
`;
