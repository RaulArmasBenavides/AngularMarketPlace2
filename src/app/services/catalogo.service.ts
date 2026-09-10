import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICategoria } from '../models/categoria.model';
import { IProducto } from '../models/producto.model';
import { environment } from '../../environments/environment';

const TANTOO_API = `${environment.apiUrl}`;

interface ProductosResponse {
  ok: boolean;
  productos: IProducto[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface CategoriasResponse {
  ok: boolean;
  categorias: ICategoria[];
}

interface ProductoResponse {
  ok: boolean;
  producto: IProducto;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  constructor(private http: HttpClient) {}

  getCategorias(): Observable<CategoriasResponse> {
    return this.http.get<CategoriasResponse>(`${TANTOO_API}/categorias`);
  }

  getProductos(filtros?: {
    categoria?: string;
    q?: string;
    page?: number;
    limit?: number;
  }): Observable<ProductosResponse> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.categoria) {
        params = params.set('categoria', filtros.categoria);
      }
      if (filtros.q) {
        params = params.set('q', filtros.q);
      }
      if (filtros.page !== undefined) {
        params = params.set('page', filtros.page.toString());
      }
      if (filtros.limit !== undefined) {
        params = params.set('limit', filtros.limit.toString());
      }
    }

    return this.http.get<ProductosResponse>(`${TANTOO_API}/productos`, { params });
  }

  getProductoPorSlug(slug: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${TANTOO_API}/productos/${slug}`);
  }

  crearProducto(datos: any): Observable<ProductoResponse> {
    return this.http.post<ProductoResponse>(`${TANTOO_API}/productos`, datos);
  }

  actualizarProducto(id: string, datos: any): Observable<ProductoResponse> {
    return this.http.put<ProductoResponse>(`${TANTOO_API}/productos/${id}`, datos);
  }

  eliminarProducto(id: string): Observable<{ ok: boolean; msg: string }> {
    return this.http.delete<{ ok: boolean; msg: string }>(`${TANTOO_API}/productos/${id}`);
  }
}
