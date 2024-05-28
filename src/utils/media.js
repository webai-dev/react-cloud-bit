import variables from 'assets/sass/partials/_exports.scss';

const parseBreakpoint = val => {
  return parseInt(val.replace('px', ''));
};

export const breakpoints = {
  xs: parseBreakpoint(variables.breakpoint_xs), // Extra small screen / phone
  sm: parseBreakpoint(variables.breakpoint_sm), // Small screen / phone
  md: parseBreakpoint(variables.breakpoint_md), // Medium screen / tablet
  lg: parseBreakpoint(variables.breakpoint_lg), // Large screen / desktop
  landscape: parseBreakpoint(variables.breakpoint_landscape), // Landscape tablet
  xl: parseBreakpoint(variables.breakpoint_xl), // Extra large screen / wide desktop
  lap: parseBreakpoint(variables.breakpoint_lap), // Small laptop
  hd: parseBreakpoint(variables.breakpoint_hd)
};

export const SidebarBreakpointsWidth = {
  xs: '176px',
  sm: '176px',
  md: '208px',
  lg: '240px',
  xl: '264px'
};

export const FormsBreakpointsClasses = 'col-12 col-sm-12 col-md-12 col-lg-6 col-xl-3';

const BitsBreakpointsWidth = {
  2: { xs: 6, md: 6, lg: 4, xl: 2 },
  4: { xs: 12, md: 10, lg: 8, xl: 4 },
  6: { xs: 12, lg: 10, xl: 6 },
  8: { xs: 12, xl: 8 },
  10: { xs: 12, xl: 10 },
  12: { xs: 12, xl: 12 }
};

export const BitsBreakpointsClasses = width => {
  const b = width * 2;

  if (BitsBreakpointsWidth[b]) {
    return Object.keys(BitsBreakpointsWidth[b])
      .map(key => {
        return (
          'col-' +
          (key !== 'xs' ? key + '-' + BitsBreakpointsWidth[b][key] : BitsBreakpointsWidth[b][key])
        );
      })
      .join(' ');
  }

  return 'col-12';
};

export const minWidth = Object.keys(breakpoints)
  .map(key => {
    return { key: key, val: breakpoints[key] };
  })
  .reduce((media, m) => {
    media[m.key] = `@media (min-width: ${m.val}px)`;
    return media;
  }, {});

export const maxWidth = Object.keys(breakpoints)
  .map(key => {
    return { key: key, val: breakpoints[key] };
  })
  .reduce((media, m) => {
    media[m.key] = `@media (max-width: ${m.val}px)`;
    return media;
  }, {});
