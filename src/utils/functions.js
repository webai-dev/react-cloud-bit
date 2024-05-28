export const capitalizeFirst = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// 0.15 => 15%
// 0.147 => 15%
// 0.004 => 0.4%
export const humanizePercentage = perc => {
  const nofloat = Math.round(perc * 100);
  if (nofloat > 0) return nofloat;
  // if < 1% round to the first decimal point
  else return Math.round(perc * 1000) / 10;
};

export const addBlurClassToBody = () => {
  if (!document.body.classList.contains('blur')) {
    document.body.className += ' blur';
  }
};

export const removeBlurClassFromBody = () => {
  document.body.className = document.body.className.replace(' blur', '');
};
