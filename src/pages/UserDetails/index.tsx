import React from 'react';
import {
  Container,
  Content,
  ContentTitle,
  EmailData,
  EmailTitle,
  GoBackButton,
  Header,
  HeaderTitle,
  Icon,
  NameData,
  NameTitle,
  UserAvatar,
  UserDetailAvatar,
  UserEmailDetail,
  UserNameDetail,
} from './styles';
import { useRoute } from '@react-navigation/native';
import { IUser } from '../../models/user';
import { api } from '../../services/api';
import avatarDefault from '../../assets/avatar02.png';

interface RouteParams {
  userId: string;
}

export const UserDetails: React.FC = () => {
  const [userDetails, setUserDetails] = React.useState<IUser>({} as IUser);

  const route = useRoute();

  const { userId } = route.params as RouteParams;

  React.useEffect(() => {
    const loadUser = async () => {
      const response = await api.get(`/users/${userId}`);
      setUserDetails(response.data);
    };
    loadUser();
  }, [userId]);

  return (
    <Container>
      <Header>
        <GoBackButton>
          <Icon />
        </GoBackButton>
        <HeaderTitle>Usuários</HeaderTitle>
        <UserAvatar
          source={
            userDetails.avatar_url
              ? { uri: userDetails.avatar_url }
              : avatarDefault
          }
        />
      </Header>

      <Content>
        <ContentTitle>Detalhes do Usuário</ContentTitle>
        <UserDetailAvatar
          source={
            userDetails.avatar_url
              ? { uri: userDetails.avatar_url }
              : avatarDefault
          }
        />

        <UserNameDetail>
          <NameTitle>NAME</NameTitle>
          <NameData>{userDetails.name}</NameData>
        </UserNameDetail>

        <UserEmailDetail>
          <EmailTitle>EMAIL</EmailTitle>
          <EmailData>{userDetails.email}</EmailData>
        </UserEmailDetail>
      </Content>
    </Container>
  );
};
