import { HttpErrorResponse } from '@angular/common/http';

/** Messaggio leggibile per un errore HTTP (il 401 e' gestito dall'interceptor). */
export function httpErrorText(err: unknown, fallback: string): string {
  const status = err instanceof HttpErrorResponse ? err.status : -1;
  if (status === 0) return 'Il server non risponde. Controlla la connessione e riprova.';
  if (status === 403) return 'Non hai i permessi per questa operazione.';
  if (status === 404) return 'Elemento non trovato: potrebbe essere già stato rimosso.';
  return fallback;
}
