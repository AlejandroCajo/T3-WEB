import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  imports: [
    MatButtonModule, 
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  selector: 'app-layout',
  styleUrl: './layout.component.css',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
