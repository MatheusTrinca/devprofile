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
  old_password: yup.string().required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
  password_confirmation: yup
    .string()
    .required('Campo obrigatório')
    .oneOf([yup.ref('password'), null], 'Confirmação incorreta'),
});

export const UserProfilePassword: React.FC = () => {
  const { goBack } = useNavigation<ScreenNavigationProp>();

  const { user, updateUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(formSchema),
  });

  const handleUpatePassword = async (form: IFormInputs) => {
    const data = {
      name: user.name,
      email: user.email,
      old_password: form.old_password,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };
    try {
      const response = await api.put('profile', data);
      Alert.alert('Senha Atualizado', 'A senha foi atualizada com sucesso');
      updateUser(response.data);
      goBack();
    } catch (error) {
      Alert.alert(
        'Erro ao atualizar a senha',
        'Ocorreu um erro ao atualizar sua senha. Tente novamente',
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
            <Title>Alterar Senha</Title>
            <InputControl
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Senha Atual"
              name="old_password"
              control={control}
              secureTextEntry
              error={errors.old_password && errors.old_password.message}
            />
            <InputControl
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Nova senha"
              name="password"
              control={control}
              secureTextEntry
              error={errors.password && errors.password.message}
            />
            <InputControl
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Confirme sua senha"
              name="password_confirmation"
              control={control}
              secureTextEntry
              error={
                errors.password_confirmation &&
                errors.password_confirmation.message
              }
            />
            <Button
              title="Salvar alterações"
              onPress={handleSubmit(handleUpatePassword)}
              disabled={
                !!errors.old_password ||
                !!errors.password ||
                errors.password_confirmation
              }
            />
          </Content>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
