import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/form/Button';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Container,
  Content,
  GoBackButton,
  Header,
  HeaderTitle,
  Icon,
  Title,
  UserAvatar,
} from './styles';
import { InputControl } from '../../components/form/InputControl';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import avatarDefault from '../../assets/avatar02.png';

interface ScreenNavigationProp {
  goBack: () => void;
  navigate: (screen: string) => void;
}

interface IFormInputs {
  [name: string]: any;
}

const formSchema = yup.object({
  name: yup
    .string()
    .max(100, 'Caracteres máximos excediods')
    .required('Insira um nome'),
  email: yup.string().email('Email inválido').required('Informe um email'),
});

export const UserProfileEdit: React.FC = () => {
  const { goBack } = useNavigation<ScreenNavigationProp>();

  const { user, updateUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const handleProfileEdit = async (form: IFormInputs) => {
    const data = {
      name: form.name,
      email: form.email,
    };
    try {
      const response = await api.put('profile', data);
      Alert.alert(
        'Perfil Atualizado',
        'Os dados do seu perfil foram atualizados',
      );
      updateUser(response.data);
      goBack();
    } catch (error) {
      Alert.alert(
        'Erro ao atualizar',
        'Ocorreu um erro ao atualizar seu perfil. Tente novamente',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <Container>
          <Header>
            <GoBackButton onPress={() => goBack()}>
              <Icon name="chevron-left" />
            </GoBackButton>
            <HeaderTitle>Seu perfil</HeaderTitle>
            <UserAvatar
              source={
                user.avatar_url ? { uri: user.avatar_url } : avatarDefault
              }
            />
          </Header>
          <Content>
            <Title>Editar dados do perfil</Title>
            <InputControl
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Nome Completo"
              name="name"
              control={control}
              error={errors.name && errors.name.message}
            />
            <InputControl
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Email"
              name="email"
              control={control}
              error={errors.email && errors.email.message}
            />
            <Button
              title="Salvar alterações"
              onPress={handleSubmit(handleProfileEdit)}
              disabled={!!errors.name || !!errors.email}
            />
          </Content>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
