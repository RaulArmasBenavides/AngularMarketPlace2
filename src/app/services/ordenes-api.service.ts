import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrden, IDireccionEnvio } from '../models/orden.model';
import { environment } from '../../environments/environment';

const TANTOO_API = `${environment.apiUrl}`;

interface OrdenesResponse {
  ok: boolean;
  ordenes: IOrden[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface OrdenResponse {
  ok: boolean;
  orden: IOrden;
  msg?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdenesApiService {
  constructor(private http: HttpClient) {}

  crearOrden(direccionEnvio: IDireccionEnvio, metodo_pago?: string): Observable<OrdenResponse> {
    return this.http.post<OrdenResponse>(`${TANTOO_API}/ordenes`, {
      direccionEnvio,
      metodo_pago,
    });
  }

  getMisOrdenes(page: number = 0, limit: number = 10): Observable<OrdenesResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<OrdenesResponse>(`${TANTOO_API}/ordenes/mis-ordenes`, { params });
  }

  getOrdenPorId(id: string): Observable<OrdenResponse> {
    return this.http.get<OrdenResponse>(`${TANTOO_API}/ordenes/${id}`);
  }

  cambiarEstado(id: string, nuevoEstado: string, nota?: string): Observable<OrdenResponse> {
    return this.http.put<OrdenResponse>(`${TANTOO_API}/ordenes/${id}/estado`, {
      nuevoEstado,
      nota,
    });
  }

  confirmarPago(ordenId: string): Observable<OrdenResponse> {
    return this.http.post<OrdenResponse>(`${TANTOO_API}/pagos/confirmar`, {
      ordenId,
    });
  }

  getTodasLasOrdenes(estado?: string, page: number = 0, limit: number = 10): Observable<OrdenesResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<OrdenesResponse>(`${TANTOO_API}/ordenes`, { params });
  }
}
