import { AfterViewInit, Component, DestroyRef, ElementRef, OnDestroy, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from 'chart.js';
import { AdminService, DashboardStats } from '../../../services/adminService';
import { httpErrorText } from '../../../services/http-error';
import { Icon } from '../../shared/icon/icon';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, Icon],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements AfterViewInit, OnDestroy {
  private readonly adminService = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('chart');
  private chart?: Chart<'doughnut'>;

  stats: DashboardStats | null = null;
  loading = true;
  error = '';

  get total(): number {
    const s = this.stats;
    return (s?.facile ?? 0) + (s?.medio ?? 0) + (s?.difficile ?? 0);
  }

  ngAfterViewInit(): void {
    this.carica();
  }

  carica(): void {
    this.loading = true;
    this.error = '';
    this.adminService
      .getFullStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.stats = res ?? {};
          this.loading = false;
          // Il canvas esiste solo dopo il render dello stato "pronto".
          queueMicrotask(() => setTimeout(() => this.renderChart()));
        },
        error: (err) => {
          this.loading = false;
          this.error = httpErrorText(err, 'Statistiche non disponibili al momento.');
        },
      });
  }

  private renderChart(): void {
    const el = this.canvas()?.nativeElement;
    if (!el || !this.stats) return;
    const css = getComputedStyle(document.documentElement);
    const v = (n: string) => css.getPropertyValue(n).trim();
    const data = [this.stats.facile ?? 0, this.stats.medio ?? 0, this.stats.difficile ?? 0];
    this.chart?.destroy();
    this.chart = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['Facile', 'Media', 'Difficile'],
        datasets: [{ data, backgroundColor: [v('--c-success'), v('--c-accent'), v('--c-primary')], borderColor: v('--c-surface'), borderWidth: 3 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: { legend: { position: 'bottom', labels: { color: v('--c-text-2'), usePointStyle: true, padding: 16 } } },
      },
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
