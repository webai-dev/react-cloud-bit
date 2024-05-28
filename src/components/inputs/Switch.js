import React, { PureComponent } from 'react';
import { css } from 'react-emotion';
import Switch from 'react-switch';
import variables from 'assets/sass/partials/_exports.scss';

class SwitchInput extends PureComponent {
  render() {
    const { id, checked, onChange } = this.props;

    return (
      <Switch
        onChange={onChange}
        checked={checked}
        id={id}
        offColor={variables.iconInactive}
        onColor={variables.primary}
        onHandleColor="#fff"
        handleDiameter={20}
        uncheckedIcon={false}
        checkedIcon={false}
        height={24}
        width={40}
        className={`react-switch ${ReactSwitchStyle}`}
      />
    );
  }
}

export default SwitchInput;

const ReactSwitchStyle = css`
  .react-switch-handle {
    box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.05), 0 3px 1px 0 rgba(0, 0, 0, 0.05),
      0 2px 2px 0 rgba(0, 0, 0, 0.1), 0 3px 3px 0 rgba(0, 0, 0, 0.05) !important;
  }
`;
