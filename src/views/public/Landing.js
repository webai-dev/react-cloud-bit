import BalloonIntro from 'components/public/landing/BalloonIntro';
import Plans from 'components/public/landing/Plans';
import PureMagic from 'components/public/landing/PureMagic';
import Secure from 'components/public/landing/Secure';
import Steps from 'components/public/landing/Steps';
import Usage from 'components/public/landing/Usage';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

class Landing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ballonIntroHeaderFirstTime: true,
      pureMagicFirstTime: true
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    if (window.scrollY <= 228) {
      // let left = 36.3 - window.scrollY * 10 / 228 ;
      let left = 63.68 - (window.scrollY * 17.54) / 228;
      document.getElementById('ballon-intro-artwork-car').style.left = '' + left + '%';
    } else {
      let secureElement = document.getElementById('secure');
      let secureElementTopPos = secureElement.getBoundingClientRect().top;
      // 553-> 20rem + 233px (position and height of the ballon) + 2
      if (window.innerHeight - secureElementTopPos - 555 >= 0 && secureElementTopPos >= 0) {
        let top = (secureElementTopPos / (window.innerHeight - 555)) * 20;
        document.getElementById('secure-env-balloon').style.top = '' + top + 'rem';
      }
    }
    if (this.state.ballonIntroHeaderFirstTime) {
      let ballonIntroElement = document.getElementById('ballon-intro-artwork-head-bottom');
      ballonIntroElement.classList.add('show');
      this.setState({ ballonIntroHeaderFirstTime: false });
    }

    if (this.state.pureMagicFirstTime) {
      let pureMagicElement = document.getElementById('pure-magic');
      let topPos = pureMagicElement.getBoundingClientRect().top;
      if (topPos + 150 <= window.innerHeight) {
        this.setState({ pureMagicFirstTime: false });
        let pureMagicHeaderElement = document.getElementById('pure-magic-header');
        pureMagicHeaderElement.classList.add('show');
      }
    }
  }

  render() {
    return (
      <Fragment>
        <BalloonIntro />
        <PureMagic />
        <Steps />
        <Secure />
        <Plans authenticated={this.props.authenticated} />
        <Usage authenticated={this.props.authenticated} />

        {/*<PrivacyBanner />*/}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated
  };
}

export default connect(
  mapStateToProps,
  {}
)(Landing);
