import React, { Component } from 'react';
import styled from 'react-emotion';

import variables from 'assets/sass/partials/_exports.scss';

export class ColorPalette extends Component {
  renderColors = () => {
    let colors = [];

    for (let i = 1; i <= 12; i++) {
      colors.push(
        <Button
          key={i}
          type="button"
          className="btn btn-color-box"
          color={variables[`bitColor${i}`]}
          shadow={this.props.selected == i ? variables[`bitSecondaryColor${i}`] : null}
          onClick={() => this.props.onChange(i)}
        />
      );
    }

    return colors;
  };

  render() {
    return (
      <ColorPaletteWrapper className="d-flex justify-content-between flex-wrap">
        {this.renderColors()}

        <ButtonClear
          type="button"
          className="btn btn-border-reverse mt-1 mx-1 w-100"
          onClick={() => this.props.onChange(null)}
        >
          No color
        </ButtonClear>
      </ColorPaletteWrapper>
    );
  }
}

export default ColorPalette;

const ColorPaletteWrapper = styled('div')`
  margin: 0 -${variables.size8};
  width: ${variables.size136};
`;

const Button = styled('button')`
  width: ${variables.size24};
  height: ${variables.size24};
  padding: 0;
  margin: ${variables.size8};
  border-radius: 0;
  background: ${props => (props.color ? props.color : '')};
  box-shadow: ${props => (props.shadow ? `inset 0px 0px 0px 3px ${props.shadow} !important` : '')};
`;

const ButtonClear = styled('button')`
  height: ${variables.size32};
  border-radius: 0;
`;
