import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik, Form } from 'formik';
import { Row, Col, Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import Input from 'components/inputs';
import ColorPalette from 'components/general/ColorPalette';
import { capitalizeFirst } from 'utils/functions';
import { createValidationSchema } from 'utils/validator';

import { fetchBitTypes, createBit } from 'views/bits/_actions';

import variables from 'assets/sass/partials/_exports.scss';

import Breadcrumbs from './Breadcrumbs';
import Container from '../MediaContainer';

class CreateBit extends Component {
  state = {
    tags: [],
    color: null,
    dropdownOpen: false
  };

  handleTagChange = tags => {
    this.setState({ tags });
  };

  componentDidMount() {
    this.props.fetchBitTypes({ team_id: this.props.active_team.id });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  toggle = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  render() {
    const { bit_types, active_team } = this.props;

    return (
      <Container>
        <div
          className="btn dropdown-item btn-dropdown-icon btn-arrow-back-icon border-bottom"
          onClick={() => this.props.previous('bit-1')}
        >
          Back
        </div>
        <div className="mt-2 mb-2 mr-3 ml-3">
          <Breadcrumbs folderId={this.props.folder} />
          <Formik
            enableReinitialize={true}
            initialValues={{ title: '', type_id: this.props.type || null }}
            validationSchema={createValidationSchema({
              title: { type: 'text', validations: { required: true } },
              tags: { type: 'array' }
            })}
            onSubmit={(values, { setSubmitting }) => {
              let params = {
                team_id: active_team.id,
                folder_id: this.props.folder,
                title: values.title,
                tags: this.state.tags.map(x => x.name),
                color: this.state.color
              };
              params.type_id = values.type_id;

              this.props
                .createBit(params)
                .then(data => {
                  this.props.close();
                  this.props.history.push(`/bit/${data.id}`);
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
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} direction="up">
                      <DropdownToggle
                        color="empty"
                        className="btn-color-palette"
                        style={{
                          color: this.state.color ? variables[`bitColor${this.state.color}`] : ''
                        }}
                        caret
                      />
                      <DropdownMenu className="px-8 py-3" style={{ height: 240 }}>
                        <ColorPalette
                          selected={this.state.color}
                          onChange={color => this.setState({ color, dropdownOpen: false })}
                        />
                      </DropdownMenu>
                    </Dropdown>
                  </Col>
                </Row>

                <div className="d-flex align-items-center justify-content-end text-right mt-4 pb-5">
                  <button
                    type="submit"
                    className="btn btn-success pr-4 pl-4"
                    disabled={isSubmitting}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-remove-link ml-4"
                    onClick={() => this.props.close()}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          />
        </div>
      </Container>
    );
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      active_team: state.teams.active,
      bit_types: state.bits.types.filter(t => t.pivot.enabled)
    }),
    {
      fetchBitTypes,
      createBit
    }
  )
)(CreateBit);
