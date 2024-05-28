import styled from 'react-emotion';
import variables from 'assets/sass/partials/_exports.scss';

export const Info = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Text = styled('div')`
  font-size: ${variables.size20};
  font-weight: 600;
`;

export const SecondaryText = styled('div')`
  font-size: 12px;
  color: ${variables.secondary};
`;
