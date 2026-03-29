import {Component, HostListener} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/authService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, Footer],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  credential = { username: '', password: '' };
  errorMess: string = '';

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  lookRotation = 0;
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

  setStealingRecipe(value: boolean) {
    this.isStealingRecipe = value;
  }

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(){
    this.errorMess = '';
    if(!this.credential.username || !this.credential.password){

      this.errorMess = 'Inserisci username e password';
      return;
    }

    this.authService.login(this.credential).subscribe({
      next: () => {
        this.router.navigate(this.authService.isAdmin() ? ['/admin/dashboard'] : ['/recipe-list']);
      },
      error: (err) => {
        if (err.status === 403) {
          this.errorMess = 'Il tuo account è stato disabilitato dall\'amministratore.';
        } else {

          this.errorMess = 'Username o password errati.';

        }
      }
    });
  }
}
