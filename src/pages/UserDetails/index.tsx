import React from 'react';
import { Container } from './styles';
import { useRoute } from '@react-navigation/native';

export const UserDetails: React.FC = () => {
  const route = useRoute();

  console.log(route);

  return <Container />;
};
