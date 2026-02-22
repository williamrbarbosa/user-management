export interface UserPayload {
  sub: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;

  iat?: number;
  exp?: number;
}
