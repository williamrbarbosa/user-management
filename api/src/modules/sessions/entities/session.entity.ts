import { User } from 'src/modules/users/entities/user.entity';

export class Session {
  id: string;

  user_id: string;
  users?: User;

  created_at: Date;
  terminated_at: Date;
}
