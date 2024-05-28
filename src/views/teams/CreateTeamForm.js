import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import { debounce } from 'lodash';
import { apiService } from 'utils/api';
import Yup from 'yup';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import UploadPhoto from 'components/inputs/UploadPhoto';
import Text from 'components/inputs/Text';

import { createTeam, editTeam } from './_actions';
import { baseDomain } from 'utils/variables';

class CreateTeamForm extends Component {
  constructor(props) {
    super(props);

    this.state = { validatingTimeout: 500, validating: false };
    this.validateSubdomain = debounce(this.validateSubdomain, 1000);
  }

  validateSubdomain = (subdomain, setErrors, errors) => {
    apiService
      .get('teams/subdomain', { params: { subdomain } })
      .then(() => {
        setErrors({
          ...errors,
          subdomain: null
        });
      })
      .catch(error => {
        setErrors({
          ...errors,
          subdomain: error.data.data ? error.data.data.subdomain : null
        });
      });
  };

  render() {
    const { active_team } = this.props;
    return (
      <Formik
        initialValues={{
          subdomain: active_team && active_team.subdomain ? active_team.subdomain : '',
          name: active_team && active_team.name ? active_team.name : '',
          photo: active_team && active_team.photo ? active_team.photo : ''
        }}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(),
          subdomain: Yup.string().required()
        })}
        onSubmit={values => {
          let params = { name: values.name, photo: values.photo, subdomain: values.subdomain };

          if (active_team && active_team.id) {
            params.id = active_team.id;
            this.props.editTeam(params).then(data => {
              if (data)
                window.location.replace(
                  `${window.location.protocol}//${values.subdomain}.${baseDomain()}`
                );
            });
          } else {
            this.props.createTeam(params).then(data => {
              if (data)
                window.location.replace(
                  `${window.location.protocol}//${values.subdomain}.${baseDomain()}`
                );
            });
          }
        }}
        render={({
          setFieldValue,
          handleChange,
          values,
          touched,
          setTouched,
          errors,
          setErrors,
          setFieldTouched
        }) => (
          <Form>
            <Text
              id="team-subdomain-field"
              value={values.subdomain}
              label="Subdomain"
              labelSize="small"
              large
              name="subdomain"
              onChange={e => {
                setFieldValue('subdomain', e.target.value, false);
                this.validateSubdomain(e.target.value, setErrors, errors);
              }}
              touched={!!errors.subdomain}
              error={errors.subdomain}
              classNameWrapper={'mb-5'}
            />
            <Text
              id="team-name-field"
              value={values.name}
              label="Name"
              labelSize="small"
              large
              name="name"
              onChange={handleChange}
              touched={touched.name}
              error={errors.name}
              classNameWrapper={'mb-5'}
            />
            <UploadPhoto
              value={values.photo}
              label="Image"
              labelSize="small"
              large
              name="photo"
              onChange={setFieldValue}
              touched={touched.photo}
              error={errors.photo}
              classNameWrapper={'mb-5'}
            />
            <div className="row">
              <div className="col-12 text-right">
                <button type="submit" className="btn btn-success mt-2 pr-5 pl-5">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-remove-link mt-2 ml-2"
                  onClick={this.props.goBack ? this.props.goBack : this.props.history.goBack}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Form>
        )}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    active_team: state.teams.active
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    { createTeam, editTeam }
  )(CreateTeamForm)
);
