import React, { Component } from 'react';
import { Col, FormGroup, Label } from 'reactstrap';
import moment from 'moment';
import styled from 'react-emotion';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import variables from 'assets/sass/partials/_exports.scss';
import Error from './Error';

export class Dates extends Component {
  state = {
    startDate: null,
    endDate: null,
    focusedInput: null
  };

  componentWillReceiveProps(nextProps, oldProps) {
    if (nextProps.startDate && nextProps.startDate !== '' && this.state.startDate === null) {
      this.setState({ startDate: moment(nextProps.startDate) });
    } else if (nextProps.startDate === '' && this.state.startDate !== null) {
      this.setState({ startDate: null });
    }

    if (nextProps.endDate && nextProps.endDate !== '' && this.state.endDate === null) {
      this.setState({ endDate: moment(nextProps.endDate) });
    } else if (nextProps.endDate === '' && this.state.endDate !== null) {
      this.setState({ endDate: null });
    }
  }

  componentWillMount() {
    if (this.props.startDate && this.props.startDate !== '' && this.state.startDate === null) {
      this.setState({ startDate: moment(this.props.startDate) });
    }

    if (this.props.endDate && this.props.endDate !== '' && this.state.endDate === null) {
      this.setState({ endDate: moment(this.props.endDate) });
    }
  }

  render() {
    const { label, id, touched, error, onChange, disabled, startDateId, endDateId } = this.props;

    return (
      <FormGroup className="form-group-wrapper" row>
        {label && (
          <Label className="mb-0" for={id} sm={12}>
            <LabelText touched={touched} error={error} disabled={disabled}>
              {label}
            </LabelText>
          </Label>
        )}
        <Col
          sm={12}
          className={
            'DateRangePicker--styled' + (touched && error ? ' DateRangePickerInput__withError' : '')
          }
        >
          <DateRangePicker
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            startDateId={startDateId}
            endDateId={endDateId}
            onDatesChange={({ startDate, endDate }) => {
              this.setState({ startDate, endDate });

              if (onChange) {
                onChange(startDateId, startDate);
                onChange(endDateId, endDate);
              }
            }}
            focusedInput={this.state.focusedInput}
            onFocusChange={focusedInput => this.setState({ focusedInput })}
            displayFormat="DD/MM/YYYY"
            small
          />
          <Error touched={touched} error={error} />
        </Col>
      </FormGroup>
    );
  }
}

export default Dates;

const InputWrapper = styled('div')`
  width: 100%;
  .DateRangePicker_picker {
    z-index: 2;
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
