import React from 'react';

import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

const OwnerCard = ({ id, name, photo, email, onClick, selected }) => (
  <OwnerContainer key={id}>
    <Profile selected={selected} name={name} photo={photo} onClick={() => onClick && onClick()} />
    <div>
      <Name>{name}</Name>
      <Email>{email}</Email>
    </div>
  </OwnerContainer>
);
export default OwnerCard;

const Profile = ({ name, photo, onClick, selected }) => (
  <ProfileContainer photo={photo} onClick={onClick} selected={selected}>
    {photo ? '' : name[0]}
  </ProfileContainer>
);

const OwnerContainer = styled('div')`
  width: 15rem;

  display: flex;
  margin-bottom: ${variables.size8};
  margin-right: ${variables.size8};
`;

const ProfileContainer = styled('div')`
  width: ${variables.size40};
  height: ${variables.size40};
  margin-right: ${variables.size16};

  border: 1px solid ${({ selected }) => (selected ? variables.primary : variables.thumbGray)};
  border-radius: 3px;
  color: ${variables.primary};
  font-size: 21px;
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: ${({ photo }) => (photo ? `url(${photo})` : 'none')};
  background-size: cover;

  cursor: pointer;
`;

const Name = styled('div')`
  max-width: 180px;
  font-size: ${variables.size14};

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
const Email = styled('div')`
  max-width: 180px;
  font-size: ${variables.size12};
  color: ${variables.textSec};

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
