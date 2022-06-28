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
  UserList,
  UserListHeader,
  UserListEmpty,
} from './styles';
import defaultAvatar from '../../assets/avatar02.png';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';
import { IUser } from '../../models/user';
import { api } from '../../services/api';
import { User } from '../../components/User';
import { useNavigation } from '@react-navigation/native';

interface IScreenNavigationProps {
  navigate: (screen: string, params?: unknown) => void;
}

export const Home: React.FC = () => {
  const { user, signOut } = useAuth();

  const [users, setUsers] = React.useState<IUser[]>([]);

  const { navigate } = useNavigation<IScreenNavigationProps>();

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

  const handleUserDetails = (userId: string) => {
    navigate('UserDetails', { userId });
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
      <UserList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <User data={item} onPress={() => handleUserDetails(item.id)} />
        )}
        ListHeaderComponent={<UserListHeader>Usuários</UserListHeader>}
        ListEmptyComponent={
          <UserListEmpty>Ops! Ainda não há registros.</UserListEmpty>
        }
      />
    </Container>
  );
};
