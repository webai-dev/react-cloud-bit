import React from 'react';
import { connect } from 'react-redux';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

import Carousel from '@brainhubeu/react-carousel';

const enhance = connect(state => ({
  items: state.bits.types.filter(type => type.background && type.tagline)
}));
const Navbar = ({ items }) => (
  <Container>
    <Carousel itemWidth={1660} draggable={false} autoPlay={4000} animationSpeed={1000} infinite>
      {items.map(item => (
        <BitCover key={item.label} background={item.background}>
          <IconContainer>
            <Icon src={item.icon} />
          </IconContainer>
          <Title>{item.label}</Title>
          <Tagline>
            {item.tagline.split('|').map(row => (
              <div key={row}>{row}</div>
            ))}
          </Tagline>
        </BitCover>
      ))}
    </Carousel>
  </Container>
);
export default enhance(Navbar);

const Container = styled('div')`
  margin-left: -34px;
`;

const IconContainer = styled('div')`
  border: 1px solid #e0e6ed;
  border-radius: 3px;
  background: white;
  width: ${variables.size48};
  height: ${variables.size48};

  padding: ${variables.size8};
  margin-right: ${variables.size16};
`;
const Icon = styled('div')`
  width: 100%;
  height: 100%;
  background: url(${props => props.src}) center center / contain no-repeat;
`;

const Title = styled('div')`
  font-size: ${variables.size40};
  font-weight: 600;

  margin-right: ${variables.size48};
`;

const Tagline = styled('div')`
  font-weight: 600;
  font-size: ${variables.size18};
`;

const BitCover = styled('div')`
  width: 100%;
  height: 128px;

  background: url('${props => props.background}');
  padding: ${variables.size32};
  display: flex;
  align-items: center;
  
  color: white;
`;
