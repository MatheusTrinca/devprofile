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
  name: yup
    .string()
    .max(100, 'Caracteres máximos excediods')
    .required('Insira um nome'),
  email: yup.string().email('Email inválido').required('Informe um email'),
  password: yup.string().required('Informe uma senha'),
});

export const SignUp: React.FC = () => {
  const { goBack, navigate } = useNavigation<ScreenNavigationProp>();

  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(formSchema),
  });

  const handleSignUp = async (form: IFormInputs) => {
    const data = {
      name: form.name,
      email: form.email,
      password: form.password,
    };
    try {
      setLoading(true);
      await api.post('users', data);
      Alert.alert(
        'Cadastro realizado',
        'Você já pode fazer login na aplicação',
      );
      navigate('SignIn');
    } catch (error) {
      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao fazer o cadastro. Tente novamente',
      );
      setLoading(false);
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
            <Title>Faça seu Cadastro</Title>
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
            <InputControl
              placeholder="Senha"
              name="password"
              control={control}
              autoCorrect={false}
              secureTextEntry
              error={errors.password && errors.password.message}
            />
            <Button
              title="Entrar"
              onPress={handleSubmit(handleSignUp)}
              disabled={
                loading || errors.name || errors.email || errors.password
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
