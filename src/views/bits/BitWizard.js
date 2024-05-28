import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import { Row, Col, Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import Input from 'components/inputs';
import ColorPalette from 'components/general/ColorPalette';
import { capitalizeFirst } from 'utils/functions';
import { createValidationSchema } from 'utils/validator';

import { fetchBitTypes, createBit, editBit, fetchBit } from './_actions';

import variables from 'assets/sass/partials/_exports.scss';

class BitWizard extends Component {
  _mounted = false;

  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      color: null,
      dropdownOpen: false
    };

    this.handleTagChange = this.handleTagChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  handleTagChange(tags) {
    this.setState({ tags });
  }

  componentDidMount() {
    this._mounted = true;

    if (this.props.bit_id && this.props.bit_id !== undefined) {
      this.props
        .fetchBit({
          bit_id: this.props.bit_id,
          team_id: this.props.active_team.id,
          view: 'simple'
        })
        .then(data => {
          if (data) {
            this.setState({
              tags: data.tags.map(x => {
                return { id: x.id, name: x.text };
              }),
              color: data.color
            });
          }
        });
    }

    this.props.fetchBitTypes({ team_id: this.props.active_team.id });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  handleRedirect = () => {
    const search = window.location.search.slice(1);
    const matches = search.split('=');

    if (matches && matches[0] === 'folder' && matches[1]) {
      this.props.history.push(`/folder/${matches[1]}`);
    } else if (this.props.active_folder) {
      this.props.history.push(`/folder/${this.props.active_folder}`);
    } else {
      this.props.history.goBack();
    }
  };

  render() {
    const { bit_types, active_team, active_folder, bits } = this.props;
    const bit = this.props.bit_id ? bits.find(b => b.id == this.props.bit_id) : null;

    return this._mounted ? (
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={{ title: bit ? bit.title : '', type_id: bit ? bit.type_id : '' }}
          validationSchema={createValidationSchema({
            title: { type: 'text', validations: { required: true } },
            tags: { type: 'array' }
          })}
          onSubmit={(values, { setSubmitting }) => {
            let params = {
              team_id: active_team.id,
              folder_id: active_folder,
              title: values.title,
              tags: this.state.tags.map(x => x.name),
              color: this.state.color
            };

            if (this.props.bit_id) {
              params.id = this.props.bit_id;
            } else {
              params.type_id = values.type_id;
            }

            (this.props.bit_id ? this.props.editBit(params) : this.props.createBit(params))
              .then(data => {
                if (data) {
                  if (this.props.bit_id) {
                    this.props.history.goBack();
                  } else {
                    this.props.history.push(
                      `/bit/${data.id}${data.folder_id ? '?folder=' + data.folder_id : ''}`
                    );
                  }
                }

                setSubmitting(false);
              })
              .catch(() => {
                setSubmitting(false);
              });
          }}
          render={({ setFieldValue, handleChange, values, touched, errors, isSubmitting }) => (
            <Form>
              <Input
                id="bit-type-field"
                tag="select"
                label="Bit Type"
                name="type_id"
                options={bit_types}
                clearable={false}
                placeholder="Select a bit type"
                onChange={(name, val) => setFieldValue(name, val)}
                value={values.type_id}
                touched={touched.type_id}
                error={errors.type_id}
                disabled={this.props.bit_id ? true : false}
              />
              <Input
                id={`title-name-field`}
                tag="text"
                value={values.title}
                label={capitalizeFirst('title')}
                name={'title'}
                type={'text'}
                onChange={handleChange}
                touched={touched.title}
                error={errors.title}
              />
              <Input
                id="bit-tags-field"
                tag="tags"
                label="Tags"
                labelPosition="aligned-top"
                name="tags"
                onChange={this.handleTagChange}
                value={this.state.tags}
              />

              <Row className="align-items-center mt-4">
                <Col xs={'auto'} className="size-14 pr-4">
                  Choose color
                </Col>
                <Col>
                  <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle
                      color="empty"
                      className="btn-color-palette"
                      style={{
                        color: this.state.color ? variables[`bitColor${this.state.color}`] : ''
                      }}
                      caret
                    />
                    <DropdownMenu className="px-8 py-3">
                      <ColorPalette
                        selected={this.state.color}
                        onChange={color => this.setState({ color, dropdownOpen: false })}
                      />
                    </DropdownMenu>
                  </Dropdown>
                </Col>
              </Row>

              <div className="d-flex align-items-center justify-content-end text-right mt-4">
                <button type="submit" className="btn btn-success pr-4 pl-4" disabled={isSubmitting}>
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-remove-link ml-4"
                  onClick={this.handleRedirect}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        />
      </div>
    ) : null;
  }
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active,
    active_folder: state.folders.active,
    bit_types: state.bits.types.filter(t => t.pivot.enabled),
    bits: state.bits.list
  };
}

export default connect(
  mapStateToProps,
  {
    fetchBitTypes,
    createBit,
    editBit,
    fetchBit
  }
)(BitWizard);
