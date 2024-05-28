// returns plans with nested product data
export const selectPlansWithProducts = state => {
  const plans = state.marketplace.plans;
  const products = state.marketplace.products;

  return plans.allIds
    .map(plan_id => {
      const plan = plans.byId[plan_id];
      const product = products.byId[plan.product] || null;
      return {
        ...plan,
        product
      };
    })
    .filter(plan => plan.product !== null);
};

// returns a list of all plan ids that the team has an active subscription on
export const selectActivePlans = state => {
  const subscriptions = state.marketplace.subscriptions;
  return {
    main: subscriptions.main && subscriptions.main.plan ? subscriptions.main.plan.id : null,
    bit: subscriptions.bit && subscriptions.bit.plan ? subscriptions.bit.plan.id : null
  };
};
