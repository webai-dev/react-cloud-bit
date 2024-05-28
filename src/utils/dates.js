import moment from 'moment';

const DEFAULT_FORMAT = 'DD/MM/YYYY HH:mm';
export const DEFAULT_API_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const format = (raw_date, format = DEFAULT_FORMAT) => {
  const date = moment(raw_date);
  return date
    ? date
        .parseZone(raw_date)
        .local()
        .format(format)
    : '';
};

export const relative = (raw_date, format = DEFAULT_FORMAT) => {
  const date = moment(raw_date);
  return date ? date.fromNow() : '';
};
