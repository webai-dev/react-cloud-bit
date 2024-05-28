import * as TYPES from './_types';
import { combineReducers } from 'redux';

const productsInitialState = { byId: {}, allIds: [], fetching: false };

const productsReducer = (state = productsInitialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_PRODUCTS:
      return {
        ...state,
        fetching: true
      };
    case TYPES.FETCH_PRODUCTS_ERROR:
      return {
        ...state,
        fetching: false
      };
    case TYPES.FETCH_PRODUCTS_SUCCESS:
      return {
        fetching: false,
        byId: action.payload.reduce(
          (all, product) => ({
            ...all,
            [product.id]: product
          }),
          {}
        ),
        allIds: action.payload.map(product => product.id)
      };

    default:
      return state;
  }
};

const plansInitialState = { byId: {}, allIds: [], fetching: false };

const plansReducer = (state = plansInitialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_PLANS:
      return {
        ...state,
        fetching: true
      };
    case TYPES.FETCH_PLANS_ERROR:
      return {
        ...state,
        fetching: false
      };
    case TYPES.FETCH_PLANS_SUCCESS:
      return {
        fetching: false,
        byId: action.payload.reduce(
          (all, plan) => ({
            ...all,
            [plan.id]: plan
          }),
          {}
        ),
        allIds: action.payload.map(plan => plan.id)
      };

    default:
      return state;
  }
};

const cardsInitialState = { byId: {}, allIds: [], fetching: false };

const cardsReducer = (state = cardsInitialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_CARDS:
      return {
        ...state,
        fetching: true
      };
    case TYPES.FETCH_CARDS_ERROR:
      return {
        ...state,
        fetching: false
      };
    case TYPES.FETCH_CARDS_SUCCESS:
      return {
        fetching: false,
        byId: action.payload.reduce(
          (all, card) => ({
            ...all,
            [card.name]: { ...card, id: card.name }
          }),
          {}
        ),
        allIds: action.payload.map(card => card.name)
      };
    case TYPES.ADD_CARD:
    case TYPES.UPDATE_CARD:
      return {
        fetching: true,
        byId: {},
        allIds: []
      };
    case TYPES.ADD_CARD_ERROR:
    case TYPES.UPDATE_CARD_ERROR:
      return {
        ...state,
        fetching: false
      };
    default:
      return state;
  }
};

const invoicesInitialState = { byId: {}, allIds: [], fetching: false };

const invoicesReducer = (state = invoicesInitialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_INVOICES:
      return {
        ...state,
        fetching: true
      };
    case TYPES.FETCH_INVOICES_ERROR:
      return {
        ...state,
        fetching: false
      };
    case TYPES.FETCH_INVOICES_SUCCESS:
      const invoices = action.payload && action.payload.length ? action.payload : [];
      return {
        fetching: false,
        byId: invoices.reduce(
          (all, invoice) => ({
            ...all,
            [invoice.id]: invoice
          }),
          {}
        ),
        allIds: invoices.map(invoice => invoice.id)
      };
    case TYPES.PAY_INVOICE_SUCCESS:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            failedRetry: false
          }
        }
      };
    case TYPES.PAY_INVOICE_ERROR:
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.payload.id]: {
            ...state.byId[action.payload.id],
            failedRetry: true
          }
        }
      };
    default:
      return state;
  }
};

const storageInitialState = { total: 0, used: 0 };

const storageReducer = (state = storageInitialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_STORAGE_SUCCESS:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

const subscriptionsInitialState = { main: null, bit: null, fetching: false };

const subscriptionsReducer = (state = subscriptionsInitialState, action) => {
  switch (action.type) {
    case TYPES.FETCH_SUBSCRIPTIONS:
      return {
        ...state,
        fetching: true
      };
    case TYPES.FETCH_SUBSCRIPTIONS_ERROR:
      return {
        ...state,
        fetching: false
      };
    case TYPES.FETCH_SUBSCRIPTIONS_SUCCESS:
      return {
        main: action.payload.main.id ? action.payload.main : null,
        bit: action.payload.bit.id ? action.payload.bit : null,
        fetching: false
      };
    case TYPES.SUBSCRIBE:
    case TYPES.CANCEL_SUBSCRIPTION:
      return {
        ...state,
        fetching: true
      };
    case TYPES.SUBSCRIBE_SUCCESS:
    case TYPES.SUBSCRIBE_ERROR:
    case TYPES.CANCEL_SUBSCRIPTION_SUCCESS:
    case TYPES.CANCEL_SUBSCRIPTION_ERROR:
      return {
        ...state,
        fetching: false
      };
    default:
      return state;
  }
};

export default combineReducers({
  products: productsReducer,
  plans: plansReducer,
  storage: storageReducer,
  subscriptions: subscriptionsReducer,
  cards: cardsReducer,
  invoices: invoicesReducer
});
