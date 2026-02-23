import { User } from 'src/modules/users/entities/user.entity';

export interface UserResponseLogin {
  tokenType: string;
  expiresIn: number;
  accessToken: string;
  sessionId: string;
  user: User;
}
