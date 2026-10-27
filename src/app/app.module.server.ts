import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { Observable } from 'rxjs';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { serverRoutes } from './app.routes.server';
import { environment } from '../environments/environment';

/**
 * En el servidor, el backend puede tener otra URL alcanzable (p. ej. el nombre del
 * servicio en Docker). Si API_INTERNAL_URL está definida, se reescribe apiUrl solo
 * para las llamadas que hace el render del servidor. El navegador sigue usando apiUrl.
 */
class ServerApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const internal = process.env['API_INTERNAL_URL'];
    if (internal && req.url.startsWith(environment.apiUrl)) {
      return next.handle(req.clone({ url: internal + req.url.slice(environment.apiUrl.length) }));
    }
    return next.handle(req);
  }
}

@NgModule({
  imports: [AppModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ServerApiInterceptor, multi: true },
    provideServerRendering(withRoutes(serverRoutes))
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
