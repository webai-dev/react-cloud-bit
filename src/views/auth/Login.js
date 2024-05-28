import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import QRCode from 'utils/qrcode';

import SvgRender from 'components/general/SvgRender';
import Input from 'components/inputs';
import Main from 'components/public/Main';
import LoginMobile from './LoginMobile';
import AcceptTermsAfterSignIn from 'components/accept-terms/AcceptTermsAfterSignIn';

import { createValidationSchema } from 'utils/validator';
import { errorHandler, MSG } from 'utils/alerts';

import loader from 'assets/svg/general/loader.svg';
import camera from 'assets/svg/public/point-camera.svg';
import apparatus from 'assets/svg/public/open-apparatus.svg';
import appStore from 'assets/svg/public/app-store.svg';
import googlePlay from 'assets/svg/public/google-play.svg';

import { teamSubdomain } from 'utils/variables';

import { LoginWrapper } from 'utils/styles/auth';

import {
  sendMagicLink,
  apparatusLogin,
  apparatusGetLogin,
  apparatusMagicFailed,
  apparatusMagicSucceed,
  magicLinkLogin,
  acceptApparatusTerms
} from './_actions';

import Apparatus from 'utils/apparatus';

const properties = {
  email: { type: 'text', validations: { required: true, email: true } }
};
const schemaValidation = createValidationSchema(properties);

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrCodeLoading: true,
      userMustAcceptTerms: false,
      apparatusUser: null
    };

    this.qrCodeRef = React.createRef();
  }

  apparatus = null;

  handleInitialization = async params => {
    await this.props.apparatusLogin(params);

    if (teamSubdomain() !== '') {
      this.props.history.push(`/`);
    } else {
      this.props.history.push(`/intro`);
    }
  };

  magicLinkLogin = async () => {
    // Apparatus magic link login
    const { token } = this.props.match.params;

    if (token) {
      try {
        // logged in successfully
        const { jwt, ...rest } = await this.apparatus.login(token);
        this.handleInitialization({ token: jwt, ...rest });
      } catch (error) {
        // handle logged in errors
        this.props.history.push('/login');
        this.props.apparatusMagicFailed(error);
      }
    }
  };

  magicLinkLoginFallback = () => {
    // Apparatus magic link fallback
    const { token } = this.props.match.params;

    this.props.magicLinkLogin({ token }).then(data => {
      if (!data) {
        this.props.history.push('/login');
      }
    });
  };

  connectToApparatus = () => {
    this.props.apparatusGetLogin().then(token => {
      if (token) {
        this.apparatus = new Apparatus({
          type: 'integration',
          token,
          email_url: process.env.REACT_APP_APPARATUS_EMAIL_UR
        });

        this.apparatus
          .connect()
          .then(() => {
            this.apparatus.on('login', ({ jwt: token, ...others }) =>
              this.handleInitialization({ ...others, token })
            );

            this.apparatus.on('error', error =>
              this.props.errorHandler({ data: { message: MSG.APPARATUS_ERROR } })
            );

            if (this.props.match.params.token) {
              this.magicLinkLogin();
            } else {
              const qrCode = new QRCode('qrcode', {
                width: 296,
                height: 296
              });

              if (this.qrCodeRef.current && this.qrCodeRef.current.childElementCount > 0) {
                this.setState({
                  qrCodeLoading: false
                });
              }

              this.apparatus.on('update_qr_code', qrData => {
                qrCode.makeCode(qrData.code);
              });
            }
          })
          .catch(() => {
            this.setState({
              qrCodeLoading: false
            });

            if (this.props.match.params.token) {
              this.props.history.push('/login');
              this.props.errorHandler({ data: { message: MSG.APPARATUS_MAGIC_LINK_ERROR } });
            } else {
              this.props.errorHandler({ data: { message: MSG.APPARATUS_ERROR } });
            }
          });
      }
    });
  };

  componentDidMount() {
    if (window.innerWidth < 768) return;

    if (
      this.props.match.params.token &&
      this.props.location.pathname.indexOf('login-internal') !== -1
    ) {
      this.magicLinkLoginFallback();
    } else {
      this.connectToApparatus();
    }
  }

  handleAcceptTerms = async () => {
    const { apparatusUser } = this.state;

    await this.props.acceptApparatusTerms({
      apparatus_id: apparatusUser.id,
      email: apparatusUser.email,
      name: apparatusUser.name
    });
    await this.props.sendMagicLink({ email: apparatusUser.email });

    this.setState({ userMustAcceptTerms: false });
  };

  componentWillUnmount() {
    if (window.innerWidth < 768) {
      return;
    }

    if (this.apparatus) this.apparatus.disconnect();
  }

  render() {
    const { qrCodeLoading, userMustAcceptTerms } = this.state;

    return (
      <Main withoutSections={['login']} className="container-fluid">
        {window.innerWidth >= 768 ? (
          <LoginWrapper className="home-wrapper d-flex align-items-center justify-content-center">
            <div className={!this.props.match.params.token ? ' d-none' : ''}>
              <img src={loader} height={80} />
            </div>
            <Row
              className={`login-inner align-items-center${
                this.props.match.params.token ? ' d-none' : ''
              }`}
            >
              <Col xs="8" md="" lg="auto">
                <div className="qrcode-wrap">
                  <div className="qrcode-inner d-flex justify-content-center align-items-center">
                    <div
                      id="qrcode"
                      ref={this.qrCodeRef}
                      className={qrCodeLoading ? 'd-none' : ''}
                    />
                    {qrCodeLoading ? <img className="loader-img" height={60} src={loader} /> : ''}
                  </div>
                </div>
              </Col>
              <Col xs="12" md="6" lg="6" xl="3" className="ml-6">
                <Row className="steps-wrapper">
                  <Col xs="12" className="mb-2">
                    <Row>
                      <Col xs="1" className="px-0">
                        <div className="step-number one text-right">1</div>
                      </Col>
                      <Col xs="auto" className="pl-0">
                        <SvgRender
                          className="step-phone"
                          style={{ height: 132 }}
                          path={apparatus}
                        />
                      </Col>
                      <Col xs="" className="d-flex align-items-center">
                        <div className="step-title">
                          Open Apparatus in <br />
                          your smart phone.
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs="12">
                    <Row>
                      <Col xs="1" className="px-0">
                        <div className="step-number two">2</div>
                      </Col>
                      <Col xs="auto" className="pl-0">
                        <SvgRender className="step-phone" style={{ height: 132 }} path={camera} />
                      </Col>
                      <Col xs="" className="d-flex align-items-center">
                        <div className="step-title">
                          Point the camera <br />
                          at the qrcode to scan.
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xs="12" xl="5" className="mt-6 mt-lg-3 mt-xl-0">
                <div className="magic-link-wrap">
                  <Row>
                    <Col xs="12" className="mb-2 magic-link-text">
                      If you forgot your smartphone, enter your email and click the button to log
                      in.
                    </Col>
                    <Col xs="12" className="mt-1">
                      <Formik
                        initialValues={{ email: '' }}
                        validationSchema={schemaValidation}
                        onSubmit={values => {
                          const data = {
                            email: values.email,
                            contact_type: 'magic'
                          };

                          this.props.sendMagicLink(data).catch(error => {
                            const apparatus_error = ('apparatus_error' in error.data) ? error.data['apparatus_error'] : undefined;

                            if (apparatus_error && apparatus_error === 'user_must_accept_terms') {
                              this.setState({
                                userMustAcceptTerms: true,
                                apparatusUser: error.data.data ? error.data.data.user : null
                              });
                            }
                          });
                        }}
                        render={({ handleChange, values, touched, errors }) => (
                          <Form>
                            <Row>
                              <Col xs="" className="form-input-wrapper">
                                <span>{touched.email}</span>
                                <Input
                                  id="folder-name-field"
                                  value={values.email}
                                  name="email"
                                  onChange={handleChange}
                                  touched={touched.email}
                                  error={errors.email}
                                />
                              </Col>
                              <Col xs="auto" className="pl-0">
                                <button
                                  type="submit"
                                  className="btn btn-black pr-4 pl-4 rounded-0"
                                  disabled={this.props.loading}
                                >
                                  Send Link
                                </button>
                              </Col>
                            </Row>
                          </Form>
                        )}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs="12" className="mt-md-2 mt-lg-5 appstores-wrap">
                <Row>
                  <Col xs="12" lg="4" className="pr-0">
                    <div className="appstore-label d-none d-lg-block mb-2">
                      Don't have Apparatus yet?
                    </div>
                    <div className="store-wrap d-none d-lg-flex">
                      <a target="_blank" href={process.env.REACT_APP_APPARATUS_LINK_APPSTORE}>
                        <SvgRender style={{ height: 56 }} path={appStore} />
                      </a>
                      <a
                        target="_blank"
                        href={process.env.REACT_APP_APPARATUS_LINK_GOOGLEPLAY}
                        className="d-none d-lg-flex"
                      >
                        <SvgRender className="ml-2" style={{ height: 56 }} path={googlePlay} />
                      </a>
                    </div>
                    <div className="terms-wrap mt-md-0 mt-lg-3">
                      By scanning the QR code, or by sending a magic link email, you agree to the{' '}
                      <br className="d-lg-none" />
                      <Link to={'/legal/terms-of-service'}>Terms and conditions</Link> and{' '}
                      <Link to={'/legal/privacy-policy'}>Privacy policy</Link>.
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </LoginWrapper>
        ) : (
          <LoginMobile />
        )}

        {userMustAcceptTerms && (
          <AcceptTermsAfterSignIn
            onSuccess={this.handleAcceptTerms}
            hasAcceptedApparatusTerms={false}
            hasAcceptedYbitTerms={this.state.apparatusUser.has_accepted_ybit_terms}
          />
        )}
      </Main>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  sendMagicLink: data => dispatch(sendMagicLink(data)),
  apparatusLogin: data => dispatch(apparatusLogin(data)),
  apparatusGetLogin: data => dispatch(apparatusGetLogin(data)),
  apparatusMagicSucceed: data => dispatch(apparatusMagicSucceed(data)),
  apparatusMagicFailed: data => dispatch(apparatusMagicFailed(data)),
  magicLinkLogin: data => dispatch(magicLinkLogin(data)),
  errorHandler: message => errorHandler(dispatch, message),
  acceptApparatusTerms: data => dispatch(acceptApparatusTerms(data))
});

function mapStateToProps(state) {
  return {
    loading: state.auth.loading
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
