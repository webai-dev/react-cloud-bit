import { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export const Scrollbar = css`
  ::-webkit-scrollbar {
    width: 5px !important;
    border-radius: 9px;
    height: 5px !important;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${variables.blue} !important;
    border-radius: 9px;
  }
  ::-webkit-scrollbar-track {
    background-color: #e6f0f7 !important;
    border-radius: 9px;
  }
`;
