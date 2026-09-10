import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class MockFirebaseInterceptor implements HttpInterceptor {
  private mockData: { [key: string]: any } = {
    'products.json': {
      'prod1': { id: 'prod1', name: 'Laptop Gaming', price: 999.99, category: 'electronics', image: 'https://via.placeholder.com/300x300?text=Laptop' },
      'prod2': { id: 'prod2', name: 'Smartphone', price: 499.99, category: 'electronics', image: 'https://via.placeholder.com/300x300?text=Phone' },
      'prod3': { id: 'prod3', name: 'Headphones', price: 199.99, category: 'electronics', image: 'https://via.placeholder.com/300x300?text=Headphones' }
    },
    'categories.json': {
      'cat1': { id: 'cat1', name: 'Electronics', slug: 'electronics' },
      'cat2': { id: 'cat2', name: 'Clothing', slug: 'clothing' },
      'cat3': { id: 'cat3', name: 'Home & Garden', slug: 'home-garden' }
    }
  };

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Detecta si es una llamada a Firebase con credenciales placeholder
    if (this.isPlaceholderFirebaseUrl(request.url)) {
      // Extrae el endpoint (ej: "products.json" de "...firebaseio.com/products.json")
      const mockKey = this.extractEndpoint(request.url);

      if (this.mockData[mockKey]) {
        // Devuelve respuesta mock
        return of(
          new HttpResponse({
            status: 200,
            body: this.mockData[mockKey]
          })
        ).pipe(delay(300));
      }
    }

    // Para requests que no son placeholders, pasa al siguiente interceptor
    return next.handle(request);
  }

  private isPlaceholderFirebaseUrl(url: string): boolean {
    // Verifica si la URL contiene la URL placeholder de Firebase
    return url.includes('project-id.firebaseio.com');
  }

  private extractEndpoint(url: string): string {
    // Extrae el endpoint de la URL
    // Ej: "https://project-id.firebaseio.com/products.json?auth=..." -> "products.json"
    const match = url.match(/firebaseio\.com\/([^?]+)/);
    return match ? match[1].trim() : '';
  }
}
