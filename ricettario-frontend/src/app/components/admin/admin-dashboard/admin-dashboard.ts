import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../services/adminService';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [Navbar, Footer, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboard implements OnInit, AfterViewInit {

  stats = { users: 0, recipes: 0, mostCommonDiff: '0' };
  loading = false;

  private chart!: Chart;

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.caricaDatiAdmin();
  }

  ngAfterViewInit() {
    this.initChart(0, 0, 0);
  }

  caricaDatiAdmin() {
    this.loading = true;

    this.adminService.getFullStats().subscribe({
      next: (res: any) => {
        this.stats = {
          users: res.users ?? 0,
          recipes: res.recipes ?? 0,
          mostCommonDiff: res.mostCommonDiff ?? 'N/D'
        };

        const f = res.facile ?? 0;
        const m = res.medio ?? 0;
        const d = res.difficile ?? 0;

        this.updateChart(f, m, d);

        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  initChart(facile: number, medio: number, difficile: number) {
    const ctx = document.getElementById('difficultyChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Facile', 'Medio', 'Difficile'],
        datasets: [
          {
            data: [facile, medio, difficile],
            backgroundColor: [
              '#22c55e',
              '#facc15',
              '#ef4444'
            ],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  updateChart(facile: number, medio: number, difficile: number) {
    if (!this.chart) {
      this.initChart(facile, medio, difficile);
      return;
    }

    this.chart.data.datasets[0].data = [facile, medio, difficile];
    this.chart.update();
  }
}
