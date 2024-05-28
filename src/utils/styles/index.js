import { css } from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export const boxesList = css`
  > li {
    margin-bottom: ${variables.size24};

    .box-wrap {
      .box-image {
        position: relative;
        padding-top: 100%;
        background-repeat: no-repeat;
        background-position: center center;
        background-color: #fff;
        border-radius: ${variables.borderRadiusBase};
        box-shadow: 0 0 16px ${variables.linesGray};
        background-size: cover;
      }

      .box-actions {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: ${variables.size32};
        padding: 0 ${variables.size8};
      }

      .box-title {
        text-align: center;
        margin-top: ${variables.size24};
        color: ${variables.textHead};
      }

      &.link-box {
        cursor: pointer;
      }

      &.create-box {
        .box-image {
          background-color: transparent;
          border: 2px dashed ${variables.textHead};

          > div {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .plus {
              fill: ${variables.textHead};
            }
          }
        }
      }
    }
  }
`;
