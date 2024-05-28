import React, { Component } from 'react';
import styled, { css } from 'react-emotion';
import { Formik, Form } from 'formik';
import Yup from 'yup';

import Select from 'react-select';

import { apiService } from 'utils/api';

import variables from 'assets/sass/partials/_exports.scss';

import Input from 'components/inputs';

import SvgRender from 'components/general/SvgRender';
import loader from 'assets/svg/general/loader.svg';

class LinkSharingModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      url: '',
      users: []
    };

    this.getOptions = this.getOptions.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    apiService
      .get(`files/${this.props.item.id}/link`)
      .then(response => {
        this.setState({ loading: false, url: response.data.url });
        return response.data;
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  onFieldChange = (field, value) => {
    this.setState({
      [field]: value
    });
  };

  getOptions(input) {
    var promise1 = Promise.resolve([1, 2, 3]);
    return promise1.then(() => {
      let options = { cache: true, options: [{ value: input, label: input }] };
      return options;
    });
  }

  publishFile() {
    this.setState({ loading: true });
    const params = { addresses: this.state.users.map(user => user.label) };
    this.props
      .publishFile({ item_id: this.props.item.id, params })
      .then(resp => {
        this.setState({ loading: false });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  }

  render() {
    return !this.state.loading ? (
      <div className="pl-3 pr-3 pb-3">
        <AccessLabel>Link to share:</AccessLabel>
        <Input readOnly classNameWrapper="mt-4 mb-4" value={this.state.url} name="input" />
        <Formik
          initialValues={{}}
          validationSchema={Yup.object().shape({})}
          onSubmit={(values, { setSubmitting }) => {
            this.publishFile();
            this.setState({ users: [] });
          }}
          render={({ setFieldValue, handleChange, values, touched, errors, isSubmitting }) => (
            <Form>
              <div className={`row pt-2 mr-0 ml-0 ${this.props.bulk !== true ? BorderTop : ''}`}>
                <div className="col-12 pl-0 pr-0">
                  <Select.Async
                    multi
                    value={this.state.users}
                    onChange={a => this.onFieldChange('users', a)}
                    loadOptions={this.getOptions}
                    autoload={false}
                    required={true}
                    cache={false}
                    placeholder="Enter email addresses"
                    name="users"
                  />
                </div>
                <div className="col-12 d-flex align-items-center justify-content-end mt-2">
                  <CancelButton onClick={this.props.changeSharingMode}>Cancel</CancelButton>
                  <button type="submit" className="btn btn-success pr-2 pl-2">
                    Done
                  </button>
                </div>
              </div>
            </Form>
          )}
        />
      </div>
    ) : (
      <SvgRender
        style={{ height: 90 }}
        className="icon"
        wrapperClassName={SharesLoader}
        path={loader}
      />
    );
  }
}

export default LinkSharingModal;

const AccessLabel = styled('div')`
  font-weight: 500;
`;

const BorderTop = css`
  border-top: 1px solid ${variables.linesGray};
`;

const CancelButton = styled('div')`
  text-align: center;
  margin-right: 1rem;
  color: ${variables.secondary};
  font-size: ${variables.size14};
  cursor: pointer;
`;

const DropdownStyle = css`
  &.show {
    .btn-dropdown {
      border-color: ${variables.primary};
    }
  }
`;

const SharesLoader = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .icon * {
    fill: ${variables.darkBlue};
  }
`;
