import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockFirebaseService {

  constructor() { }

  // Mock Products
  getProducts(): Observable<any> {
    const mockProducts = {
      'prod1': {
        id: 'prod1',
        name: 'Laptop Gaming',
        price: 999.99,
        category: 'electronics',
        image: 'https://via.placeholder.com/300x300?text=Laptop'
      },
      'prod2': {
        id: 'prod2',
        name: 'Smartphone',
        price: 499.99,
        category: 'electronics',
        image: 'https://via.placeholder.com/300x300?text=Phone'
      },
      'prod3': {
        id: 'prod3',
        name: 'Headphones',
        price: 199.99,
        category: 'electronics',
        image: 'https://via.placeholder.com/300x300?text=Headphones'
      }
    };
    return of(mockProducts).pipe(delay(300));
  }

  // Mock Categories
  getCategories(): Observable<any> {
    const mockCategories = {
      'cat1': {
        id: 'cat1',
        name: 'Electronics',
        slug: 'electronics'
      },
      'cat2': {
        id: 'cat2',
        name: 'Clothing',
        slug: 'clothing'
      },
      'cat3': {
        id: 'cat3',
        name: 'Home & Garden',
        slug: 'home-garden'
      }
    };
    return of(mockCategories).pipe(delay(300));
  }

  // Mock Users
  getUser(uid: string): Observable<any> {
    const mockUser = {
      uid: uid,
      email: 'user@example.com',
      displayName: 'John Doe',
      country: 'USA',
      city: 'New York'
    };
    return of(mockUser).pipe(delay(300));
  }

  // Mock generic GET
  getData(path: string): Observable<any> {
    const mockData: { [key: string]: any } = {
      'products': this.getProducts(),
      'categories': this.getCategories(),
      'users': { user1: this.getUser('user1') }
    };
    return mockData[path] || of({}).pipe(delay(300));
  }

  // Mock generic POST/PUT
  postData(path: string, data: any): Observable<any> {
    return of({ success: true, id: Math.random().toString(36) }).pipe(delay(300));
  }

  // Mock generic PATCH
  patchData(path: string, data: any): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  // Mock generic DELETE
  deleteData(path: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }
}
