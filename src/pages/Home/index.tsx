import React from 'react';
import {
  Container,
  Header,
  UserAvatar,
  UserAvatarButton,
  UserGreeting,
  UserInfo,
  UserInfoDetail,
  UserName,
  UserWrapper,
  Icon,
  LogOutButton,
} from './styles';
import defaultAvatar from '../../assets/avatar02.png';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { IUser } from '../../models/user';
import { api } from '../../services/api';

export const Home: React.FC = () => {
  const { user, signOut } = useAuth();

  const [users, setUsers] = React.useState<IUser[]>([]);

  React.useEffect(() => {
    const loadUsers = async () => {
      const response = await api.get('users');
      setUsers(response.data);
    };

    loadUsers();
  }, []);

  const handleSignOut = () => {
    Alert.alert('Tem certeza?', 'Deseja realmente sair da aplicação?', [
      {
        text: 'Cancelar',
        onPress: () => {},
      },
      {
        text: 'Sair',
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <UserAvatarButton onPress={() => {}}>
              <UserAvatar
                source={
                  user.avatar_url ? { uri: user.avatar_url } : defaultAvatar
                }
              />
            </UserAvatarButton>
            <UserInfoDetail>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>{user.name}</UserName>
            </UserInfoDetail>
          </UserInfo>
          <LogOutButton onPress={handleSignOut}>
            <Icon name="power" />
          </LogOutButton>
        </UserWrapper>
      </Header>
    </Container>
  );
};
