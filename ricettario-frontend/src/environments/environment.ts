/**
 * Configurazione runtime del frontend.
 * Modifica `apiUrl` per puntare al backend (es. in produzione).
 *
 * `youtubeApiKey` e' opzionale: se vuota la sezione "Video tutorial" non viene mostrata.
 * Attenzione: qualsiasi chiave inserita qui finisce nel bundle pubblico. Usa una chiave
 * limitata per HTTP referrer e per la sola YouTube Data API, e non committarla.
 */
export const environment = {
  apiUrl: 'http://localhost:8080/api',
  youtubeApiKey: '',
};
