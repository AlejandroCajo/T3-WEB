import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const token = loginService.getToken();

  let clonedReq = req;
  // Propaga el token JWT si existe y no es la petición de inicio de sesión
  if (token && !req.url.includes('/login')) {
    clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(clonedReq).pipe(
    catchError((error) => {
      // Si el backend rechaza la petición por token no válido o vencido (401), se limpia la sesión
      if (error.status === 401 && !req.url.includes('/login')) {
        loginService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
