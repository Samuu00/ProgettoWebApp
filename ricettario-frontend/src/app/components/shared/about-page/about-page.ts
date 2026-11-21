import { Component } from '@angular/core';

interface Member { name: string; role: string; bio: string }

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.html',
  styleUrl: './about-page.css',
})
export class AboutUs {
  readonly groups: { title: string; members: Member[] }[] = [
    {
      title: 'Coordinamento',
      members: [{ name: 'Samuele Pironaci', role: 'Frontend Manager & Angular Supervisor', bio: "L'architetto dell'esperienza utente, colui che trasforma il codice in arte visiva." }],
    },
    {
      title: 'Frontend e dati',
      members: [
        { name: 'Damian Andrea Dimasi', role: 'HTML & CSS Specialist', bio: 'Il custode dello stile. Ogni pixel è posizionato con precisione chirurgica.' },
        { name: 'Marco Pio Campanella', role: 'Database Manager', bio: 'Il signore dei dati. Organizza la memoria del gusto con query impeccabili.' },
      ],
    },
    {
      title: 'Backend',
      members: [
        { name: 'Agostino Scarano', role: 'Backend Developer', bio: 'Motore e logica. Gestisce i flussi invisibili che rendono tutto possibile.' },
        { name: 'Pantaleone Catanzariti', role: 'Backend Developer', bio: "Performance e stabilità. Il braccio destro dell'infrastruttura." },
      ],
    },
  ];

  initials(name: string): string {
    return name.split(' ').map((p) => p[0]).slice(0, 2).join('');
  }
}
