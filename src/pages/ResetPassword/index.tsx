import React from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/form/Button';
import { Logo } from '../SignIn/styles';
import logo from '../../assets/logo.png';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  BackToSignIn,
  BackToSignInTitle,
  Container,
  Content,
  Icon,
  Title,
} from './styles';
import { InputControl } from '../../components/form/InputControl';
import { api } from '../../services/api';

interface ScreenNavigationProp {
  goBack: () => void;
  navigate: (screen: string) => void;
}

interface IFormInputs {
  [name: string]: any;
}

const formSchema = yup.object({
  token: yup.string().uuid('Informe um código válido'),
  password: yup.string().required('Informe uma senha'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Confirmação incorreta'),
});

export const ResetPassword: React.FC = () => {
  const { goBack, navigate } = useNavigation<ScreenNavigationProp>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(formSchema),
  });

  const handleResetPassword = async (form: IFormInputs) => {
    const data = {
      token: form.token,
      password: form.password,
      password_confirmation: form.password_confirmation,
    };
    try {
      await api.post('password/reset', data);
      Alert.alert('Senha Redefinida', 'Você já pode fazer login na aplicação');
      navigate('SignIn');
    } catch (error) {
      console.log(error);
      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao redefinir sua senha. Tente novamente',
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
          <Content>
            <Logo source={logo} />
            <Title>Redefina sua senha</Title>
            <InputControl
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="Código"
              name="token"
              control={control}
              error={errors.token && errors.token.message}
            />
            <InputControl
              placeholder="Nova senha"
              name="password"
              control={control}
              autoCorrect={false}
              secureTextEntry
              error={errors.password && errors.password.message}
            />
            <InputControl
              placeholder="Confirme sua senha"
              name="password_confirmation"
              control={control}
              autoCorrect={false}
              secureTextEntry
              error={
                errors.password_confirmation &&
                errors.password_confirmation.message
              }
            />
            <Button
              title="Salvar"
              onPress={handleSubmit(handleResetPassword)}
              disabled={
                errors.token || errors.password || errors.password_confirmation
              }
            />
          </Content>
        </Container>
      </ScrollView>
      <BackToSignIn onPress={() => goBack()}>
        <Icon name="arrow-left" />
        <BackToSignInTitle>Voltar</BackToSignInTitle>
      </BackToSignIn>
    </KeyboardAvoidingView>
  );
};
