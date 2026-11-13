import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoginService } from '../services/login.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage.set('Por favor, complete todos los campos.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.loginService.login({ username: this.username.trim(), password: this.password.trim() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        // Redirige al componente Category dentro del layout
        this.router.navigate(['/pages/category']);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('Credenciales incorrectas. Verifique usuario y contraseña.');
        } else {
          this.errorMessage.set('Error al conectar con el servidor backend (' + (err.status || '500') + ').');
        }
      }
    });
  }

  fillDemo(user: 'admin' | 'user'): void {
    if (user === 'admin') {
      this.username = 'testing1@example.com';
      this.password = '123';
    } else {
      this.username = 'testing2@example.com';
      this.password = '123';
    }
    this.errorMessage.set(null);
  }
}
