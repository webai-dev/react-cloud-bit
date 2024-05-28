import orderBy from 'lodash/orderBy';
import moment from 'moment';

export default function sort(items, sortBy) {
  switch (sortBy) {
    case 'alphabetical_ascending':
      return orderBy(items, [s => s.title.toLowerCase()], ['asc']);
    case 'alphabetical_descending':
      return orderBy(items, [s => s.title.toLowerCase()], ['desc']);
    case 'last_created':
      return orderBy(items, [item => moment(item.created_at)], ['desc']);
    case 'recently_edited':
      return orderBy(items, [item => moment(item.updated_at)], ['desc']);
    default:
      return items;
  }
}
