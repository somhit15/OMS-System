export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  is_active: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
