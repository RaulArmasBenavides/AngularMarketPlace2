import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Sweetalert } from '../../functions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem('idToken');
          localStorage.removeItem('expiresIn');
          this.router.navigate(['/login']);
        } else if (error.status === 0) {
          Sweetalert.fnc('error', 'Sin conexión a internet', null);
        } else if (error.status >= 500) {
          Sweetalert.fnc('error', 'Error del servidor. Intenta más tarde', null);
        }
        return throwError(() => error);
      })
    );
  }
}
