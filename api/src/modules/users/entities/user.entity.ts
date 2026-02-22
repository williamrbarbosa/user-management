export class User {
  id: string;

  first_name: string;
  last_name: string;
  email: string;
  password?: string;

  status: string;

  login_count?: number;

  created_at?: Date;
  updated_at?: Date;
}
