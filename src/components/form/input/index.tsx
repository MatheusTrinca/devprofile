import React from 'react';
import { Container } from './styles';
import theme from '../../../global/styles/theme';
import { TextInputProps } from 'react-native';

export const Input: React.FC<TextInputProps> = ({ ...otherProps }) => {
  return (
    <Container placeholderTextColor={theme.colors.gray500} {...otherProps} />
  );
};
