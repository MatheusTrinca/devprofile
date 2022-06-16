import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
`;

export const Error = styled.Text`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-bottom: 16px;
`;
