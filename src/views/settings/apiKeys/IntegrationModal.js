import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import { apiService } from 'utils/api';
import { Formik, Form } from 'formik';
import Input from 'components/inputs';
import Yup from 'yup';
import loader from 'assets/svg/general/loader.svg';
import SvgRender from 'components/general/SvgRender';
import CopyClip from './common/CopyClip';
import { errorHandler } from 'utils/alerts';

import Tree from 'components/general/Tree';

class IntegrationModal extends Component {
  state = {
    step: 1,
    loading: false,
    url: null,
    key: null,
    secret: null,
    show: false
  };

  validationSchema = Yup.object().shape({
    url: Yup.string().required(),
    folders: Yup.array().required()
  });

  toggleSecret = () => this.setState(prev => ({ show: !prev.show }));

  handleSubmit = async values => {
    this.setState({ loading: true });
    try {
      await this.props.onSubmit(values);
      this.setState({ loading: false });
      this.props.toggle();
    } catch (error) {
      this.setState({ loading: false });
      this.props.errorHandler(error);
    }
  };

  render() {
    const { step, loading } = this.state;
    const { selected } = this.props;

    return (
      <div className="mx-4 mt-4 mb-3">
        {loading ? (
          <div className="d-flex align-items-center justify-content-center" style={{ height: 170 }}>
            <SvgRender style={{ height: 40 }} path={loader} />
          </div>
        ) : step === 1 ? (
          <Formik
            initialValues={
              selected
                ? {
                    url: selected.url,
                    folders: selected.folders.map(folder => ({ id: folder.id, type: 'folder' }))
                  }
                : { url: '', folders: [] }
            }
            validationSchema={this.validationSchema}
            onSubmit={this.handleSubmit}
            render={({ setFieldValue, handleChange, values, touched, errors, isSubmitting }) => (
              <Form>
                <div className="mb-2">This URL will be enabled for the Integration.</div>
                <div className="d-flex">
                  <div className="mr-1" style={{ marginTop: 6 }}>
                    URL
                  </div>
                  <Input
                    id="url"
                    value={values.url}
                    name="url"
                    onChange={handleChange}
                    touched={touched.url}
                    error={errors.url}
                    classNameWrapper={css`
                      flex-grow: 1;
                    `}
                  />
                </div>
                <div className="mb-2">Select Folders.</div>
                {touched.folders && errors.folders && <Error>{errors.folders}</Error>}
                <div style={{ height: 400, overflowY: 'overlay' }}>
                  <Tree
                    shared
                    selected={values.folders}
                    multiple
                    onSelect={items => setFieldValue('folders', items)}
                    perms="share"
                  />
                </div>
                <hr />
                <div className="d-flex justify-content-end align-items-center">
                  <button
                    className="btn btn-main btn-dropdown-icon d-flex align-items-center "
                    disabled={isSubmitting}
                    type="submit"
                  >
                    <div className="mx-2">{selected ? 'Edit' : 'Create'}</div>
                  </button>
                </div>
              </Form>
            )}
          />
        ) : (
          <div>
            <div>
              <Row>
                <Title>URL</Title>
                <Value>{this.state.url}</Value>
              </Row>
              <Row>
                <Title>Access key ID</Title>
                <Value>
                  <CopyClip text={this.state.key} message="Access key ID copied!" width={160} />
                </Value>
              </Row>
              <Row>
                <Title>Secret access key</Title>
                <Value>
                  <CopyClip
                    text={this.state.secret}
                    message="Secret access key copied!"
                    width={190}
                  >
                    <div className="d-flex align-items-center">
                      <PasswordInput
                        value={this.state.secret}
                        type={this.state.show ? 'text' : 'password'}
                        readOnly
                      />
                      <SvgRender
                        style={{ height: 18, cursor: 'pointer' }}
                        path={require('assets/svg/actions/show.svg')}
                        onClick={this.toggleSecret}
                      />
                    </div>
                  </CopyClip>
                </Value>
              </Row>
            </div>
            <Warning>
              *This is the only time that the secret access keys can be viewed or downloaded. You
              cannot recover them later. However, you can create new access keys at any time.
            </Warning>
            <div className="pt-3 d-flex justify-content-end">
              <div
                className="btn btn-success btn-dropdown-icon d-flex align-items-center "
                onClick={this.props.toggle}
              >
                <div className="mx-2">Done</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  null,
  dispatch => ({ errorHandler: message => errorHandler(dispatch, message) })
)(IntegrationModal);

const Row = styled('div')`
  margin-bottom: ${variables.size16};
  &:last-child {
    margin-bottom: ${variables.size40};
  }
`;

const Title = styled('div')`
  display: inline-block;
  width: 112px;
  margin-right: ${variables.size24};
`;

const Error = styled('div')`
  font-size: 12px;
  color: ${variables.red};
  margin-top: -16px;
`;

const Value = styled('div')`
  width: 350px;
  display: inline-block;
  word-break: break-all;
`;

const PasswordInput = styled('input')`
  width: 320px;
  outline: none;
  border: none;
  background: transparent;
  margin-right: ${variables.size16};
`;

const Warning = styled('div')`
  font-size: ${variables.size12};
  color: ${variables.red};
  padding-bottom: ${variables.size8};
  border-bottom: 1px solid ${variables.linesGray};
`;
