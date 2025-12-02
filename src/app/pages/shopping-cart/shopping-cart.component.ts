import { Component, OnInit, OnDestroy } from '@angular/core';

import { Path } from '../../config';
import { DinamicPrice, Sweetalert } from '../../functions';

import { ProductsService } from '../../services/products.service';

import { Router } from '@angular/router';

interface ShoppingCartItem {
  url: string;
  name: string;
  category: string;
  image: string;
  delivery_time: string;
  quantity: number;       // cantidad
  unitPrice: number;      // precio unitario
  unitShipping: number;   // envío unitario
  details: string;        // HTML string con detalles
  listDetails: string;    // json string de detalles (para comparación)
  subTotal: number;       // subtotal (precio + envío) * cantidad
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
  standalone: false
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  path: string = Path.url;

  shoppingCart: ShoppingCartItem[] = [];
  totalShoppingCart: number = 0;

  // Total general del carrito
  totalAmount: number = 0;

  // Para mostrar spinner mientras carga
  loadingCart: boolean = true;

  // Mensaje del popover (si usas ngx-bootstrap o similar)
  popoverMessage: string = 'Are you sure to remove it?';

  constructor(
    private readonly productsService: ProductsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadShoppingCartFromLocalStorage();
  }

  // =========================================================
  // Carga inicial del carrito desde localStorage (sin jQuery)
  // =========================================================
  private loadShoppingCartFromLocalStorage(): void {
    const listStr = localStorage.getItem('list');
    if (!listStr) {
      this.loadingCart = false;
      return;
    }

    const list = JSON.parse(listStr);
    this.totalShoppingCart = list.length;

    if (list.length === 0) {
      this.loadingCart = false;
      return;
    }

    let load = 0;

    for (const i in list) {
      const cartItem = list[i];

      this.productsService.getFilterData('url', cartItem.product).subscribe((resp: any) => {
        for (const f in resp) {
          const product = resp[f];

          let detailsHtml = `<div class="list-details small text-secondary">`;

          if (cartItem.details?.length > 0) {
            const specification = JSON.parse(cartItem.details);
            for (const spec of specification) {
              const properties = Object.keys(spec);
              for (const prop of properties) {
                detailsHtml += `<div>${prop}: ${spec[prop]}</div>`;
              }
            }
          } else {
            if (product.specification) {
              const specification = JSON.parse(product.specification);
              for (const spec of specification) {
                const property = Object.keys(spec).toString();
                detailsHtml += `<div>${property}: ${spec[property][0]}</div>`;
              }
            }
          }

          detailsHtml += `</div>`;

          // Precio unitario (ajusta según cómo funcione DinamicPrice.fnc)
          // 
          const dynamicPriceResult = 0;// DinamicPrice.fnc(product);
          const unitPrice = 10;//Number(dynamicPriceResult?.[0] ?? 0);

          const quantity = Number(cartItem.unit ?? 1);
          const unitShipping = Number(product.shipping ?? 0);

          const item: ShoppingCartItem = {
            url: product.url,
            name: product.name,
            category: product.category,
            image: product.image,
            delivery_time: product.delivery_time,
            quantity,
            unitPrice,
            unitShipping,
            details: detailsHtml,
            listDetails: cartItem.details,
            subTotal: 0 // se calcula abajo
          };

          this.shoppingCart.push(item);
        }

        load++;

        if (load === list.length) {
          // cuando terminó de cargar todo
          this.recalculateTotals();
          this.loadingCart = false;
        }
      });
    }
  }

  // =========================================================
  // Recalcular subtotales y total general
  // =========================================================
  private recalculateTotals(): void {
    let total = 0;

    this.shoppingCart = this.shoppingCart.map((item) => {
      const sub = (item.unitPrice + item.unitShipping) * item.quantity;
      total += sub;
      return {
        ...item,
        subTotal: sub
      };
    });

    this.totalAmount = total;
  }

  // =========================================================
  // Cambio de cantidad (sin jQuery)
  // =========================================================
  changeQuantity(
    quantity: number,
    move: 'up' | 'down' | 'direct',
    productUrl: string,
    details: any,
    index: number
  ): void {
    // límites
    let newQuantity = Number(quantity);

    if (newQuantity > 9) newQuantity = 9;
    if (newQuantity < 1) newQuantity = 1;

    if (move === 'up' && newQuantity < 9) {
      newQuantity = newQuantity + 1;
    } else if (move === 'down' && newQuantity > 1) {
      newQuantity = newQuantity - 1;
    }

    // actualizamos en memoria
    this.shoppingCart[index].quantity = newQuantity;

    // actualizamos en localStorage
    const listStr = localStorage.getItem('list');
    if (listStr) {
      const shoppingCartLocal = JSON.parse(listStr);
      shoppingCartLocal.forEach((x: any) => {
        if (x.product === productUrl && x.details == details.toString()) {
          x.unit = newQuantity;
        }
      });
      localStorage.setItem('list', JSON.stringify(shoppingCartLocal));
    }

    // recalcular totales
    this.recalculateTotals();
  }

  // =========================================================
  // Remover producto (sin jQuery ni DataTables)
  // =========================================================
  removeProduct(product: any, details: any): void {
    const listStr = localStorage.getItem('list');
    if (!listStr) {
      return;
    }

    let shoppingCartLocal = JSON.parse(listStr);

    shoppingCartLocal = shoppingCartLocal.filter(
      (x: any) => !(x.product === product && x.details == details.toString())
    );

    localStorage.setItem('list', JSON.stringify(shoppingCartLocal));

    // Actualizamos el array en memoria
    this.shoppingCart = this.shoppingCart.filter(
      (x) => !(x.url === product && x.listDetails == details.toString())
    );

    this.totalShoppingCart = this.shoppingCart.length;
    this.recalculateTotals();

    Sweetalert.fnc('success', 'product removed', this.router.url);
  }

  ngOnDestroy(): void {
    // ya no hay dtTrigger ni DataTables que destruir
  }
}
