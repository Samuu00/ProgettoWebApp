import {Component, HostListener} from '@angular/core';
import { AuthService } from '../../../services/authService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, CommonModule, RouterModule, Footer],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email: string = '';
  emailSent: boolean = false;
  lookRotation = 0;
  errorMess: string = '';

  constructor(private authService: AuthService) {}

  onRecover() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.emailSent = true;
      },
      error: (err) => {
        this.errorMess = "Email non trovata. Controlla di aver inserito l'indirizzo email corretto."
      }
    });
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  isStealingRecipe = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isStealingRecipe) {
      this.lookRotation = 0;
      return;
    }

    const centerX = window.innerWidth / 2;
    const mouseX = event.clientX;

    const offset = (mouseX - centerX) / centerX;

    this.lookRotation = offset * 20;
  }
}
