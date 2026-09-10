import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ICarrito } from '../models/carrito.model';
import { environment } from '../../environments/environment';

const TANTOO_API = `${environment.apiUrl}`;

interface CarritoResponse {
  ok: boolean;
  carrito: ICarrito;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoApiService {
  private carritoSubject = new BehaviorSubject<ICarrito | null>(null);
  carrito$ = this.carritoSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCarrito(): Observable<CarritoResponse> {
    return this.http
      .get<CarritoResponse>(`${TANTOO_API}/carrito`)
      .pipe(
        tap((res) => {
          if (res.ok) {
            this.carritoSubject.next(res.carrito);
          }
        })
      );
  }

  agregarItem(
    productoId: string,
    cantidad: number,
    varianteSku?: string
  ): Observable<CarritoResponse> {
    return this.http
      .post<CarritoResponse>(`${TANTOO_API}/carrito/items`, {
        productoId,
        cantidad,
        varianteSku,
      })
      .pipe(
        tap((res) => {
          if (res.ok) {
            this.carritoSubject.next(res.carrito);
          }
        })
      );
  }

  actualizarItem(
    productoId: string,
    cantidad: number,
    varianteSku?: string
  ): Observable<CarritoResponse> {
    return this.http
      .put<CarritoResponse>(`${TANTOO_API}/carrito/items`, {
        productoId,
        cantidad,
        varianteSku,
      })
      .pipe(
        tap((res) => {
          if (res.ok) {
            this.carritoSubject.next(res.carrito);
          }
        })
      );
  }

  eliminarItem(productoId: string, varianteSku?: string): Observable<CarritoResponse> {
    return this.http
      .delete<CarritoResponse>(`${TANTOO_API}/carrito/items`, {
        body: { productoId, varianteSku },
      })
      .pipe(
        tap((res) => {
          if (res.ok) {
            this.carritoSubject.next(res.carrito);
          }
        })
      );
  }

  vaciarCarrito(): Observable<CarritoResponse> {
    return this.http
      .delete<CarritoResponse>(`${TANTOO_API}/carrito`)
      .pipe(
        tap((res) => {
          if (res.ok) {
            this.carritoSubject.next(res.carrito);
          }
        })
      );
  }

  obtenerCarritoLocal(): ICarrito | null {
    return this.carritoSubject.getValue();
  }
}
