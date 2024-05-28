import { capitalizeFirst } from 'utils/functions';
import Yup from 'yup';
import pickBy from 'lodash/pickBy';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validateFields = Texts => {
  let fields = [...Texts];

  fields.forEach(x => {
    x.error = requiredError(x);
    if (!x.error) {
      if (x.name === 'email') {
        x.error = emailError(x);
      }
    }
  });

  const hasErrors = fields.some(x => x.error);

  return hasErrors ? fields : null;
};

export const requiredError = field => {
  const error = `${capitalizeFirst(field.name)} is required`;
  return !field.value || field.value === '+' ? error : null;
};

export const emailError = field => {
  return EMAIL_REGEX.test(field.value.toLowerCase()) ? null : 'Invalid email address';
};

export const isEmail = string => {
  return EMAIL_REGEX.test(String(string).toLowerCase());
};

const fieldTypes = {
  text: 'string',
  password: 'string',
  email: 'string',
  url: 'string',
  textarea: 'string',
  editor: 'string',
  photo: 'string',
  number: 'number',
  date: 'date',
  array: 'array'
};
const validationTypes = {
  string: {
    required: true,
    url: true,
    email: true
  },
  number: {
    required: true
  },
  date: {
    required: true
  },
  array: {
    required: true
  }
};

export const createValidationSchema = properties => {
  const validations = pickBy(properties, function(value, key) {
    return value.validations;
  });
  const YupObj = Object.keys(validations).reduce((obj, current) => {
    let field_type = fieldTypes[validations[current].type];
    obj[current] = Yup[field_type]();

    let rules = validations[current].validations;
    Object.keys(rules).forEach(key => {
      let type = validationTypes[field_type][key];
      if (type) {
        obj[current] = obj[current][key](rules[key] !== true ? rules[key] : '');
      }
    });

    return obj;
  }, {});
  return Yup.object().shape(YupObj);
};
