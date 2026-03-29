import { Utente } from './user'

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse{
  token: string;
  user: Utente;
}
