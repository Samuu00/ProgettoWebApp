export interface Ricetta {
  id? : number;
  titolo : string;
  descrizione: string;
  autore: string;
  idAutore?: number;
  ingredienti: Ingredienti[];
  istruzioni: string;
  tempoCottura: number;
  categoria: string;
  difficolta: Difficolta;
  immagineURL: string;
  dataCreaz: string;
  status: Stato;
}

export interface Ingredienti{
  name: string;
  quantita: number;
  unitaMis: string;
  carboidrati: number;
  grassi: number;
  proteine: number;
}

export enum Difficolta{
  FACILE = "FACILE",
  MEDIO = "MEDIO",
  DIFFICILE = "DIFFICILE"
}

export enum Stato{
  BOZZA = 'BOZZA',
  SCARTATA = 'SCARTATA',
  APPROVATA = 'APPROVATA'
}
