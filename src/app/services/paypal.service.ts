import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {
  private paypalScriptLoaded = false;

  constructor() {}

  loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resuelve inmediatamente
      if (this.paypalScriptLoaded) {
        resolve();
        return;
      }

      // Crea el elemento script
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}`;
      script.async = true;
      script.onload = () => {
        this.paypalScriptLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load PayPal SDK'));
      };

      document.body.appendChild(script);
    });
  }
}
