import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const TANTOO_API = `${environment.apiUrl}`;

interface AuthResponse {
  ok: boolean;
  usuario: { id: string; nombre: string; email: string; role: string };
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthTantooService {
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    this.cargarUsuarioGuardado();
  }

  registro(nombre: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${TANTOO_API}/usuarios`, {
        nombre,
        email,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.ok) {
            localStorage.setItem('tantooToken', res.token);
            localStorage.setItem('tantooUsuario', JSON.stringify(res.usuario));
            this.usuarioSubject.next(res.usuario);
          }
        })
      );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${TANTOO_API}/usuarios/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.ok) {
            localStorage.setItem('tantooToken', res.token);
            localStorage.setItem('tantooUsuario', JSON.stringify(res.usuario));
            this.usuarioSubject.next(res.usuario);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('tantooToken');
    localStorage.removeItem('tantooUsuario');
    this.usuarioSubject.next(null);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('tantooToken');
  }

  obtenerUsuario(): any {
    return this.usuarioSubject.getValue();
  }

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  private cargarUsuarioGuardado(): void {
    const usuario = localStorage.getItem('tantooUsuario');
    if (usuario) {
      this.usuarioSubject.next(JSON.parse(usuario));
    }
  }
}
