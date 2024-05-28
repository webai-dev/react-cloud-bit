import * as TYPES from './_types';
import { reduce } from 'lodash';
import { apiService } from 'utils/api';
import { errorHandler, successHandler, MSG } from 'utils/alerts';
import { selectPlansWithProducts } from './_selectors';

const getActiveTeamId = state => state.teams.active.id;

export const fetchProducts = () => (dispatch, getState) => {
  const team = getActiveTeamId(getState());

  dispatch({ type: TYPES.FETCH_PRODUCTS });
  apiService
    .get(`/teams/${team}/products`)
    .then(res =>
      dispatch({
        type: TYPES.FETCH_PRODUCTS_SUCCESS,
        payload: res.data.map(product => ({
          id: product.id,
          type: product.metadata.type,
          name: product.name,
          description: product.metadata.description,
          custom: product.metadata.custom || false,
          disabled: !product.active,
          storage: product.metadata.storage
        }))
      })
    )
    .catch(error => {
      dispatch({ type: TYPES.FETCH_PRODUCTS_ERROR });
      errorHandler(dispatch, error);
    });
};

export const fetchPlans = () => (dispatch, getState) => {
  dispatch({ type: TYPES.FETCH_PLANS });
  apiService
    .get(`/plans`)
    .then(res =>
      dispatch({
        type: TYPES.FETCH_PLANS_SUCCESS,
        payload: res.data.map(plan => ({
          id: plan.id,
          interval: plan.interval,
          amount: plan.amount,
          product: plan.product
        }))
      })
    )
    .catch(error => {
      dispatch({ type: TYPES.FETCH_PLANS_ERROR });
      errorHandler(dispatch, error);
    });
};

export const fetchStorage = () => (dispatch, getState) => {
  const team = getActiveTeamId(getState());

  dispatch({
    type: TYPES.FETCH_STORAGE
  });
  return apiService
    .get(`/teams/${team}/storage`)
    .then(res =>
      dispatch({
        type: TYPES.FETCH_STORAGE_SUCCESS,
        payload: res.data
      })
    )
    .catch(error => {
      dispatch({ type: TYPES.FETCH_STORAGE_ERROR });
      errorHandler(dispatch, error);
    });
};

export const fetchCards = () => (dispatch, getState) => {
  const team = getActiveTeamId(getState());

  dispatch({
    type: TYPES.FETCH_CARDS
  });
  return apiService
    .get(`/teams/${team}/billing/cards`)
    .then(res =>
      dispatch({
        type: TYPES.FETCH_CARDS_SUCCESS,
        payload: res.data
      })
    )
    .catch(error => {
      dispatch({ type: TYPES.FETCH_CARDS_ERROR });
      errorHandler(dispatch, error);
    });
};

export const fetchSubscriptions = () => (dispatch, getState) => {
  const team = getActiveTeamId(getState());

  dispatch({
    type: TYPES.FETCH_SUBSCRIPTIONS
  });
  return apiService
    .get(`/teams/${team}/subscriptions`)
    .then(res =>
      dispatch({
        type: TYPES.FETCH_SUBSCRIPTIONS_SUCCESS,
        payload: res.data
      })
    )
    .catch(error => {
      dispatch({ type: TYPES.FETCH_SUBSCRIPTIONS_ERROR });
      errorHandler(dispatch, error);
    });
};

export const subscribe = planId => (dispatch, getState) => {
  const state = getState();

  const team = getActiveTeamId(state);
  const type = selectPlansWithProducts(state).find(plan => plan.id === planId).product.type;

  const params = { plan_code: planId, type };
  dispatch({ type: TYPES.SUBSCRIBE, params });
  return apiService
    .put(`/teams/${team}/subscriptions`, params)
    .then(res => {
      dispatch({ type: TYPES.SUBSCRIBE_SUCCESS, params });
      successHandler(dispatch, res.data.message);
      dispatch(fetchSubscriptions());
    })
    .catch(error => {
      dispatch({ type: TYPES.SUBSCRIBE_ERROR });
      errorHandler(dispatch, error);
    });
};

export const cancelSubscription = type => (dispatch, getState) => {
  const state = getState();

  const team = getActiveTeamId(state);
  const subId = state.marketplace.subscriptions[type].id;

  dispatch({ type: TYPES.CANCEL_SUBSCRIPTION });
  return apiService
    .delete(`/teams/${team}/subscriptions/${subId}`)
    .then(res => {
      dispatch({ type: TYPES.CANCEL_SUBSCRIPTION_SUCCESS });
      successHandler(dispatch, res.data.message);
      dispatch(fetchSubscriptions());
    })
    .catch(error => {
      dispatch({ type: TYPES.CANCEL_SUBSCRIPTION_ERROR });
      errorHandler(dispatch, error);
    });
};

export const addCard = token => (dispatch, getState) => {
  const team = getActiveTeamId(getState());

  dispatch({ type: TYPES.ADD_CARD });
  return apiService
    .post(`/teams/${team}/billing`, { token: token })
    .then(res => {
      dispatch({ type: TYPES.ADD_CARD_SUCCESS });
      successHandler(dispatch, res.data.message);
      dispatch(fetchCards());
    })
    .catch(error => {
      dispatch({ type: TYPES.ADD_CARD_ERROR });
      errorHandler(dispatch, error);
    });
};

export const updateCard = token => (dispatch, getState) => {
  const team = getActiveTeamId(getState());

  dispatch({ type: TYPES.UPDATE_CARD });
  return apiService
    .put(`/teams/${team}/billing`, { token })
    .then(res => {
      dispatch({ type: TYPES.UPDATE_CARD_SUCCESS });
      successHandler(dispatch, res.data.message);
      dispatch(fetchCards());
    })
    .catch(error => {
      dispatch({ type: TYPES.UPDATE_CARD_ERROR });
      errorHandler(dispatch, error);
    });
};

export const fetchInvoices = () => (dispatch, getState) => {
  const team = getActiveTeamId(getState());

  dispatch({ type: TYPES.FETCH_INVOICES });
  return apiService
    .get(`/teams/${team}/billing/invoices`)
    .then(res => {
      dispatch({ type: TYPES.FETCH_INVOICES_SUCCESS, payload: res.data });
    })
    .catch(error => {
      dispatch({ type: TYPES.FETCH_INVOICES_ERROR });
      errorHandler(dispatch, error);
    });
};

export const payInvoice = id => dispatch => {
  dispatch({ type: TYPES.PAY_INVOICE });
  return apiService
    .post('/invoice/pay', { invoice_id: id })
    .then(res => {
      dispatch({ type: TYPES.PAY_INVOICE_SUCCESS, payload: { id } });
      dispatch(fetchInvoices());
    })
    .catch(error => {
      dispatch({ type: TYPES.PAY_INVOICE_ERROR, payload: { id } });
      errorHandler(dispatch, error);
    });
};
