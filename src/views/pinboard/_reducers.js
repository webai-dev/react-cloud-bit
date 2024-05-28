import * as TYPES from './_types';
import _findIndex from 'lodash/findIndex';

const INITIAL_STATE = {
  pinTypes: [],
  pins: [],
  currentPage: 0,
  lastPage: 0,
  active: {},
  favourite_count: 0,
  showFavorites: false,
  loading: false
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.FETCH_PIN_TYPES_SUCCESS:
      return {
        ...state,
        pinTypes: action.payload.filter(value => value.label !== 'map').map(value => ({
          value: value.label,
          type_id: value.id,
          label: value.name
        }))
      };

    case TYPES.FETCH_PINS:
    case TYPES.FETCH_PINS_ERROR:
      return {
        ...state,
        pins: [],
        currentPage: 0,
        lastPage: 0
      };

    case TYPES.FETCH_PINS_SUCCESS:
      return {
        ...state,
        pins: action.payload.pins.data,
        currentPage: action.payload.pins.current_page,
        lastPage: action.payload.pins.last_page,
        favourite_count: action.payload.favourite_count
      };
    case TYPES.LOAD_MORE_PINS_SUCCESS:
      return {
        ...state,
        pins: state.pins.concat(action.payload.pins.data),
        currentPage: action.payload.pins.current_page,
        lastPage: action.payload.pins.last_page
      };

    case TYPES.FETCH_PIN:
    case TYPES.FETCH_PIN_ERROR:
      return {
        ...state,
        active: {}
      };

    case TYPES.FETCH_PIN_SUCCESS:
      return {
        ...state,
        active: action.payload
      };

    case TYPES.FAVOURITE_PIN_SUCCESS: {
      let index = _findIndex(state.pins, ['id', action.payload]);

      let pins = state.pins.map((pin, i) => {
        if (i !== index) {
          return pin;
        }

        return {
          ...pin,
          favourite: pin.favourite ? 0 : 1
        };
      });

      let favourite_count =
        pins[index].favourite === 1
          ? state.favourite_count + 1
          : pins[index].favourite === 0
            ? state.favourite_count - 1 > 0 ? state.favourite_count - 1 : 0
            : 0;

      if (state.showFavorites === true) {
        pins = pins.filter((pin, i) => {
          return i !== index || (i === index && pin.favourite === 1);
        });
      }

      return {
        ...state,
        pins,
        favourite_count: favourite_count
      };
    }

    case TYPES.TOGGLE_FAVORITES:
      return {
        ...state,
        showFavorites: !state.showFavorites
      };

    case TYPES.DELETE_PIN_SUCCESS:
      return {
        ...state,
        pins: state.pins.filter(x => {
          return x.id !== action.payload.params.id;
        })
      };

    case TYPES.SET_LOADING_STATUS:
      return { ...state, loading: action.payload };

    default:
      return state;
  }
}
