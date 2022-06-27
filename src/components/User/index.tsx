import React from 'react';
import {
  Container,
  EmailData,
  EmailTitle,
  NameData,
  NameTitle,
  UserAvatar,
  UserDetail,
  UserEmailDetail,
  UserNameDetail,
} from './styles';
import defaultAvatar from '../../assets/avatar02.png';
import { IUser } from '../../models/user';

interface IUserProps {
  data: IUser;
  onPress: () => void;
}

export const User: React.FC<IUserProps> = ({ data, onPress }) => {
  return (
    <Container onPress={onPress}>
      <UserDetail>
        <UserNameDetail>
          <NameTitle>NAME</NameTitle>
          <NameData>{data.name}</NameData>
        </UserNameDetail>

        <UserEmailDetail>
          <EmailTitle>EMAIL</EmailTitle>
          <EmailData>{data.email}</EmailData>
        </UserEmailDetail>
      </UserDetail>

      <UserAvatar
        source={data.avatar_url ? { uri: data.avatar_url } : defaultAvatar}
      />
    </Container>
  );
};
