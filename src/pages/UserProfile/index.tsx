import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Content,
  EmailData,
  EmailTitle,
  GoBackButton,
  Header,
  HeaderTitle,
  HeaderTop,
  Icon,
  NameData,
  NameTitle,
  PhotoButton,
  PhotoContainer,
  UserAvatar,
  UserEmailDetail,
  UserNameDetail,
} from './styles';
import avatarDefault from '../../assets/avatar02.png';
import { Button } from '../../components/form/Button';

interface ScreenNavigationProps {
  goBack: () => void;
  navigate: (screen: string) => void;
}

export const UserProfile: React.FC = () => {
  const { user } = useAuth();

  const { goBack, navigate } = useNavigation<ScreenNavigationProps>();

  return (
    <Container>
      <Header>
        <HeaderTop>
          <GoBackButton onPress={() => goBack()}>
            <Icon name="chevron-left" />
          </GoBackButton>
          <HeaderTitle>Seu Perfil</HeaderTitle>
        </HeaderTop>

        <PhotoContainer>
          <UserAvatar
            source={user.avatar_url ? { uri: user.avatar_url } : avatarDefault}
          />
          <PhotoButton>
            <Icon name="camera" />
          </PhotoButton>
        </PhotoContainer>
      </Header>

      <Content>
        <UserNameDetail>
          <NameTitle>NAME</NameTitle>
          <NameData>{user.name}</NameData>
        </UserNameDetail>

        <UserEmailDetail>
          <EmailTitle>EMAIL</EmailTitle>
          <EmailData>{user.email}</EmailData>
        </UserEmailDetail>

        <Button
          title="Editar dados do perfil"
          onPress={() => navigate('UserProfileEdit')}
        />
        <Button
          title="Trocar Senha"
          onPress={() => navigate('UserProfilePassword')}
        />
      </Content>
    </Container>
  );
};
