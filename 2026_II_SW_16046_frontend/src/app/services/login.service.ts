import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.HOST}/login`;

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.url, credentials).pipe(
      tap((res) => {
        if (res && res.access_token) {
          sessionStorage.setItem('token', res.access_token);
        }
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  isLogged(): boolean {
    return !!this.getToken();
  }
}
