/** Stesse regole lato UI per registrazione e reset (il backend resta l'autorita'). */
export const PASSWORD_RULES = [
  { label: 'Almeno 8 caratteri', test: (p: string) => p.length >= 8 },
  { label: 'Una lettera maiuscola', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un numero', test: (p: string) => /\d/.test(p) },
  { label: 'Un simbolo tra @ $ ! % * ? &', test: (p: string) => /[@$!%*?&]/.test(p) },
];

export function isStrongPassword(p: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(p)) && /^[A-Za-z\d@$!%*?&]+$/.test(p);
}
