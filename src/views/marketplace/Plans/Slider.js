import React, { Component } from 'react';

import Carousel from '@brainhubeu/react-carousel';

import SvgRender from 'components/general/SvgRender';
import arrow from 'assets/svg/general/arrow-dropdown.svg';

class Slider extends Component {
  state = { slidesPerPage: 4, value: 0 };

  componentDidMount() {
    if (window.innerWidth <= 1440) {
      this.setState({ slidesPerPage: 3 });
    }
  }

  onChange = value => this.setState({ value });

  next = () => this.setState(prev => ({ value: prev.value + 1 }));
  prev = () => this.setState(prev => ({ value: prev.value - 1 }));

  render() {
    const hasNext =
      this.state.value + this.state.slidesPerPage < React.Children.count(this.props.children);
    const hasPrev = this.state.value > 0;

    return (
      <div className="d-flex">
        <SvgRender
          path={arrow}
          style={{
            height: 14,
            transform: 'rotate(90deg)',
            opacity: hasPrev ? 1 : 0,
            cursor: 'pointer'
          }}
          onClick={() => hasPrev && this.prev()}
        />
        <div style={{ width: window.innerWidth <= 1440 ? 700 : 900 }}>
          <Carousel
            slidesPerPage={this.state.slidesPerPage}
            draggable={false}
            value={this.state.value}
            onChange={this.onChange}
          >
            {this.props.children}
          </Carousel>
        </div>

        <SvgRender
          path={arrow}
          style={{
            height: 14,
            transform: 'rotate(270deg)',
            opacity: hasNext ? 1 : 0,
            cursor: 'pointer'
          }}
          onClick={() => hasNext && this.next()}
        />
      </div>
    );
  }
}
export default Slider;
