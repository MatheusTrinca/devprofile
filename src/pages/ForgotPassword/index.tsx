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
  email: yup.string().email('Email inválido').required('Informe um email'),
});

export const ForgotPassword: React.FC = () => {
  const { goBack, navigate } = useNavigation<ScreenNavigationProp>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(formSchema),
  });

  const handleForgotPassword = async (form: IFormInputs) => {
    const data = {
      email: form.email,
    };
    try {
      await api.post('password/forgot', data);
      Alert.alert('Email enviado', 'Redefina sua senha');
      navigate('ResetPassword');
    } catch (error) {
      Alert.alert(
        'Erro no envio do email',
        'Ocorreu um erro ao enviar o email. Tente novamente',
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
            <Title>Informe seu email</Title>
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
              title="Enviar"
              onPress={handleSubmit(handleForgotPassword)}
              disabled={errors.email}
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
