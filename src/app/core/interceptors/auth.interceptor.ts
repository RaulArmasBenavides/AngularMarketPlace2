import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('idToken');
    const isFirebaseDB = req.url.includes(environment.firebase.databaseURL);

    if (token && isFirebaseDB) {
      const authReq = req.clone({
        params: req.params.set('auth', token)
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
