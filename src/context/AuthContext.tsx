import React from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { IUser } from '../models/user';

interface IAuthContext {
  user: IUser;
  signIn: (credentials: ICredentials) => void;
  signOut: () => void;
}

interface IProps {
  children: React.ReactElement;
}

interface ICredentials {
  email: string;
  password: string;
}

interface IAuthState {
  token: string;
  user: IUser;
}

const tokenData = '@DevProfile:token';
const userData = '@DevProfile:user';

export const AuthContext = React.createContext<IAuthContext>(
  {} as IAuthContext,
);

export const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [data, setData] = React.useState<IAuthState>({} as IAuthState);

  React.useEffect(() => {
    const loadAuthData = async () => {
      const token = await AsyncStorage.getItem(tokenData);
      const user = await AsyncStorage.getItem(userData);

      if (token && user) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setData({ token, user: JSON.parse(user) });
      }
    };
    loadAuthData();
  }, []);

  const signIn = async ({ email, password }: ICredentials) => {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      });
      const { token, user } = response.data;

      await AsyncStorage.setItem(tokenData, token);
      await AsyncStorage.setItem(userData, JSON.stringify(user));

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setData({ token, user });
    } catch (error) {
      new Error(error as string);
      Alert.alert(
        'Erro na autenticação',
        'Ocorreu um erro ao fazer login, cheque suas credenciais',
      );
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(tokenData);
    await AsyncStorage.removeItem(userData);

    setData({} as IAuthState);
  };

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
