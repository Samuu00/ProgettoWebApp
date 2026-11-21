import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-page',
  template: `
    <div class="container container--narrow page">
      <header class="page-head"><div><h1>Privacy</h1><p>Come trattiamo i tuoi dati, in breve.</p></div></header>
      <article class="prose surface surface--pad">
        <h2>Trattamento dei dati</h2>
        <p>I tuoi dati (username, email e i contenuti che pubblichi) vengono trattati esclusivamente per garantirti l'accesso alla piattaforma e il suo funzionamento. Non vendiamo né cediamo i tuoi dati a terzi.</p>
        <h2>Sicurezza</h2>
        <p>Le password sono salvate in forma cifrata (hash) e l'accesso alle funzioni riservate è protetto da token con scadenza.</p>
        <h2>Archiviazione locale</h2>
        <p>Il sito non usa cookie di profilazione. Nel browser vengono salvati solo il token di sessione, i dati essenziali del profilo e la preferenza di tema chiaro/scuro; vengono rimossi quando esci.</p>
        <h2>Contatti</h2>
        <p>Per domande sulla gestione dei tuoi dati contatta il team del progetto tramite i canali ufficiali.</p>
        <p class="updated">Ultimo aggiornamento: 29 gennaio 2026</p>
      </article>
    </div>
  `,
  styles: `.prose h2:first-child { margin-top: 0; } .updated { margin-top: var(--s-6) !important; font-size: var(--fs-sm); color: var(--c-text-3); }`,
})
export class Privacy {}
