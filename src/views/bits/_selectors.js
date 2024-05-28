export const supportsFullscreen = (state, id) => {
  let bit = [...state.bits.list, ...state.dashboard.bits, ...state.shares.bits].find(
    bit => bit.id === id
  );
  if (!bit) return false;

  const bitType = state.bits.types.find(type => type.id === bit.type_id);
  if (!bitType) return false;
  return bitType.fullscreen;
};
