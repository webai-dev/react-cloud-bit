import React from 'react';
import { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

const RadioList = ({ options, onSelectionChange }) => (
  <div className="d-flex flex-column">
    {options.map((item, index) => (
      <Radio
        key={item.id}
        selected={item.selected}
        text={item.text}
        onSelection={onSelectionChange(index)}
      />
    ))}
  </div>
);

export default RadioList;

export const Radio = ({ selected, onSelection, text }) => (
  <div className={wrapper} onClick={onSelection}>
    <div className="radio-box">{selected && <div className={'check'} />}</div>
    {text}
  </div>
);

const wrapper = css`
  padding-bottom: ${variables.size16};

  cursor: pointer;

  display: flex;
  align-items: center;

  .radio-box {
    height: ${variables.size16};
    width: ${variables.size16};
    border: 1px solid #d6dbe1;
    border-radius: ${variables.size8};

    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: ${variables.size8};

    .check {
      height: ${variables.size8};
      width: ${variables.size8};
      border-radius: 9px;
      background-color: #3c8bc0;
    }
  }
`;
