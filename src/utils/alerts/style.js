import variables from 'assets/sass/partials/_exports.scss';

const defaults = {
  color: '#142438',
  backgroundColor: '#fff',
  boxShadow: 'none'
};

export default {
  Containers: {
    DefaultStyle: {
      width: '376px',
      padding: 0,
      marginRight: 0,
      height: 'auto'
    },
    br: {
      top: 'auto',
      bottom: variables.size64,
      left: 'auto',
      right: variables.size64
    }
  },
  MessageWrapper: {
    DefaultStyle: {
      padding: 0,
      margin: `${variables.size4} ${variables.size20} ${variables.size4} ${variables.size8} `
    }
  },
  Dismiss: {
    DefaultStyle: {
      backgroundColor: 'transparent',
      fontSize: variables.size16,
      lineHeight: variables.size16,
      height: variables.size16,
      width: variables.size16,
      fontFamily: 'inherit',
      top: `calc(50% - ${variables.size8})`,
      right: variables.size24,
      opacity: 0.6
    },

    success: {
      color: variables.alertSuccessColor
    },

    error: {
      color: variables.alertErrorColor
    },

    warning: {
      color: variables.alertWarningColor
    },

    info: {
      color: variables.alertInfoColor
    }
  },
  Title: {
    DefaultStyle: {
      fontSize: variables.size14,
      margin: `${variables.size4} ${variables.size8} ${variables.size4} 0`,
      padding: 0,
      fontWeight: 'bold'
    },

    success: {
      color: variables.alertSuccessColor
    },

    error: {
      color: variables.alertErrorColor
    },

    warning: {
      color: variables.alertWarningColor
    },

    info: {
      color: variables.alertInfoColor
    }
  },
  NotificationItem: {
    DefaultStyle: {
      fontSize: variables.size14,
      lineHeight: 'normal',
      fontFamily: variables.fontFamilyBase,
      borderRadius: variables.borderRadiusBase,
      borderWidth: '1px',
      borderStyle: 'solid',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      margin: `${variables.size16} 0px 0px`,
      padding: `${variables.size16} ${variables.size24}`,
      WebkitBoxShadow: defaults.boxShadow,
      MozBoxShadow: defaults.boxShadow,
      boxShadow: defaults.boxShadow
    },
    success: {
      borderColor: variables.alertSuccessBorder,
      color: variables.alertSuccessColor,
      backgroundColor: variables.alertSuccessBg
    },
    error: {
      borderColor: variables.alertErrorBorder,
      color: variables.alertErrorColor,
      backgroundColor: variables.alertErrorBg
    },
    warning: {
      borderColor: variables.alertWarningBorder,
      color: variables.alertWarningColor,
      backgroundColor: variables.alertWarningBg
    },
    info: {
      borderColor: variables.alertInfoBorder,
      color: variables.alertInfoColor,
      backgroundColor: variables.alertInfoBg
    }
  },
  Action: {
    DefaultStyle: {
      background: defaults.backgroundColor,
      borderRadius: `${variables.size8}`,
      padding: `${variables.size8} ${variables.size24}`,
      fontWeight: 'bold',
      margin: `${variables.size8} 0`,
      border: 0
    },
    success: {
      backgroundColor: variables.alertSuccessColor
    },
    error: {
      backgroundColor: variables.alertErrorColor
    },
    warning: {
      backgroundColor: variables.alertWarningColor
    },
    info: {
      backgroundColor: variables.alertInfoColor
    }
  }
};
