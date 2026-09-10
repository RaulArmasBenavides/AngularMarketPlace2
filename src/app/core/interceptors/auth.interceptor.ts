import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const firebaseToken = localStorage.getItem('idToken');
    const tantooToken = localStorage.getItem('tantooToken');

    const isFirebaseDB = req.url.includes(environment.firebase.databaseURL);
    const isTantooApi = req.url.includes(environment.apiUrl);

    // Firebase Realtime DB: inyecta token como query param
    if (firebaseToken && isFirebaseDB) {
      const authReq = req.clone({
        params: req.params.set('auth', firebaseToken)
      });
      return next.handle(authReq);
    }

    // TantooServiceRestNode: inyecta token como header x-token
    if (tantooToken && isTantooApi) {
      const authReq = req.clone({
        setHeaders: {
          'x-token': tantooToken
        }
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
