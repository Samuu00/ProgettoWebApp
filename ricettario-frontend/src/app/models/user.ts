export interface Utente {
  id: number;
  username: string;
  email: string;
  ruolo: 'STANDARD' | 'ADMIN';
  stato: boolean;
}
