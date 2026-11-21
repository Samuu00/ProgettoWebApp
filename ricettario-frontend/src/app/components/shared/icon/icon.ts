import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type Circle = [cx: number, cy: number, r: number];
type Rect = [x: number, y: number, w: number, h: number, rx: number];
interface IconDef { p?: string[]; c?: Circle[]; r?: Rect[] }

/** Set di icone a tratto (geometrie in stile Lucide, licenza ISC), 24x24, stroke 2. */
const ICONS = {
  search: { c: [[11, 11, 8]], p: ['m21 21-4.3-4.3'] },
  clock: { c: [[12, 12, 10]], p: ['M12 6v6l4 2'] },
  heart: { p: ['M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'] },
  star: { p: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'] },
  plus: { p: ['M5 12h14M12 5v14'] },
  pencil: { p: ['M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z', 'm15 5 4 4'] },
  trash: { p: ['M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'] },
  eye: { p: ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'], c: [[12, 12, 3]] },
  'eye-off': {
    p: [
      'M9.88 9.88a3 3 0 1 0 4.24 4.24',
      'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68',
      'M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61',
      'm2 2 20 20',
    ],
  },
  check: { p: ['M20 6 9 17l-5-5'] },
  x: { p: ['M18 6 6 18M6 6l12 12'] },
  'log-out': { p: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'] },
  user: { p: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'], c: [[12, 7, 4]] },
  users: { p: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'], c: [[9, 7, 4]] },
  menu: { p: ['M4 6h16M4 12h16M4 18h16'] },
  sun: { c: [[12, 12, 4]], p: ['M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41'] },
  moon: { p: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'] },
  shield: { p: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'] },
  message: { p: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'] },
  chart: { p: ['M21.21 15.89A10 10 0 1 1 8 2.83', 'M22 12A10 10 0 0 0 12 2v10z'] },
  'arrow-left': { p: ['m12 19-7-7 7-7M19 12H5'] },
  alert: { c: [[12, 12, 10]], p: ['M12 8v4M12 16h.01'] },
  'chef-hat': {
    p: [
      'M17 21a1 1 0 0 0 1-1v-5.35c0-.46.32-.84.73-1.04a4 4 0 0 0-2.13-7.59 5 5 0 0 0-9.19 0 4 4 0 0 0-2.13 7.59c.41.2.72.58.72 1.04V20a1 1 0 0 0 1 1Z',
      'M6 17h12',
    ],
  },
  book: { p: ['M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z', 'M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'] },
  refresh: { p: ['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8', 'M21 3v5h-5', 'M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16', 'M8 16H3v5'] },
  image: { r: [[3, 3, 18, 18, 2]], c: [[9, 9, 2]], p: ['m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21'] },
  lock: { r: [[3, 11, 18, 11, 2]], p: ['M7 11V7a5 5 0 0 1 10 0v4'] },
  mail: { r: [[2, 4, 20, 16, 2]], p: ['m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7'] },
  utensils: { p: ['M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20', 'M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7'] },
  tag: { p: ['M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z'], c: [[7.5, 7.5, 1]] },
  clipboard: { r: [[8, 2, 8, 4, 1]], p: ['M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'm9 14 2 2 4-4'] },
  play: { p: ['M6 3l14 9-14 9V3z'] },
  upload: { p: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'] },
  ban: { c: [[12, 12, 10]], p: ['m4.9 4.9 14.2 14.2'] },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[style.--icon-size.px]': 'size()' },
  template: `
    <svg viewBox="0 0 24 24" [attr.fill]="filled() ? 'currentColor' : 'none'" stroke="currentColor"
         stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
      @for (d of def().p ?? []; track $index) { <path [attr.d]="d" /> }
      @for (c of def().c ?? []; track $index) { <circle [attr.cx]="c[0]" [attr.cy]="c[1]" [attr.r]="c[2]" /> }
      @for (r of def().r ?? []; track $index) {
        <rect [attr.x]="r[0]" [attr.y]="r[1]" [attr.width]="r[2]" [attr.height]="r[3]" [attr.rx]="r[4]" />
      }
    </svg>
  `,
  styles: `
    :host { display: inline-flex; flex-shrink: 0; width: var(--icon-size); height: var(--icon-size); }
    svg { width: 100%; height: 100%; }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  readonly filled = input(false);
  protected readonly def = computed<IconDef>(() => ICONS[this.name()]);
}
