import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';
import { minWidth, maxWidth, breakpoints } from 'utils/media';

export const LoginWrapper = styled('div')`
  width: 100%;
  min-height: calc(100vh - 10rem);

  @media (max-width: ${breakpoints.lg - 1}px) {
    min-height: calc(100vh - 13rem);
  }

  .login-inner {
    position: relative;

    ${minWidth.xs + '{ width: 100%; }'};
    ${minWidth.xl + '{ width: 100%; }'};
    ${minWidth.lap + '{ width: 90%; }'};
    ${minWidth.hd + '{ width: 80%; }'};

    .subtitle {
      font-size: ${variables.size24};
    }

    .brand-name {
      font-size: ${variables.size32};
    }

    .instructions-wrap {
      ol {
        list-style: decimal;
        margin-left: ${variables.size16};
      }
    }

    .steps-wrapper {
      .step-phone {
        ${minWidth.xs + '{ height: 80px !important; width: 40px; }'};
        ${minWidth.md + '{ height: 88px !important; width: 48px; }'};
        ${minWidth.hd + '{ height: 132px !important; width: 72px; }'};
      }

      .step-number {
        font-size: ${variables.size24};
        position: relative;
        z-index: 1;
        width: ${variables.size16};

        &:before {
          content: '';
          position: absolute;
          height: 4px;
          width: 16px;
          background: ${variables.publicBorder};
          z-index: -1;
        }

        &.one {
          &:before {
            left: -1px;
            bottom: ${variables.size16};
          }
        }

        &.two {
          &:before {
            left: 4px;
            bottom: ${variables.size20};
          }
        }
      }

      .step-title {
        font-size: ${variables.size18};
      }
    }

    .magic-link-wrap {
      .magic-link-text {
        font-size: ${variables.size18};
      }

      .form-input-wrapper {
        ${maxWidth.hd + '{ max-width: 70%; }'};
      }

      .form-group-wrapper {
        margin-bottom: 0px !important;

        .form-control {
          height: ${variables.size40};
          border-color: ${variables.publicInputBorderColor};
          border-radius: 0px;
        }
      }

      .error-wrapper {
        position: absolute;
      }
    }

    .appstores-wrap {
      .appstore-label {
        font-size: ${variables.size18};
      }

      .terms-wrap {
        font-size: ${variables.size12};
        position: relative;
        z-index: 1;

        &:before {
          content: '';
          position: absolute;
          height: 2px;
          width: 68px;
          background: linear-gradient(270deg, #e2f2f2 0%, ${variables.publicLink} 100%);
          top: 12px;
          left: -${variables.size8};
          z-index: -1;
        }

        a {
          text-decoration: underline !important;
          color: ${variables.publicLink};
        }
      }
    }

    .qrcode-wrap {
      height: 328px;
      position: relative;

      ${minWidth.xs + '{ width: 100%; height: auto; }'};
      ${minWidth.xl + '{ width: 328px; height: 328px; }'};
      box-shadow: 0 10px 30px 0 rgba(55, 55, 55, 0.5);

      ${maxWidth.lap + '{ width: 240px; height: 240px; img { width: 240px; height: 240px; }}'};

      img:not(.loader-img) {
        width: 328px;
        height: 328px;
      }

      &:before {
        content: '';
        height: calc(100% - 40px);
        position: absolute;
        border: 3px solid #fff;
        right: -32px;
        top: 32px;
        width: 50%;
        z-index: 1;
        border: 6px solid ${variables.publicLink};
      }

      .qrcode-inner {
        height: 100%;
        background: #fff;
        padding: ${variables.size16};

        position: relative;
        z-index: 10;

        #qrcode {
          width: 100%;
          height: 100%;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  &.after-login-inner {
    padding: ${variables.size8} 0;
    background-color: #ffff;
    max-height: calc(100vh - ${variables.size80});
    overflow-y: auto;
    position: relative;
    top: ${variables.size80};

    .header {
      height: ${variables.size80};
    }

    .login-inner {
      height: 100%;
      max-height: inherit;
      min-height: inherit;

      .selection-wrapper {
        max-height: inherit;
      }
    }
  }
`;
