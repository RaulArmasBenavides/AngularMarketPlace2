import { Component, OnInit } from '@angular/core';
import { Path } from '../../config';
import { Search, DinamicPrice, Sweetalert } from '../../functions';

import { CategoriesService } from '../../services/categories.service';
import { SubCategoriesService } from '../../services/sub-categories.service';
import { ProductsService } from '../../services/products.service';
import { UsersService } from '../../services/users.service';

import { Router } from '@angular/router';

interface ShoppingCartItem {
  url: string;
  name: string;
  category: string;
  image: string;
  delivery_time: string;
  quantity: number;
  price: number;          // precio unitario
  shipping: number;       // envío unitario
  details: string;        // HTML string que ya construyes
  listDetails: string;
}

interface SubCategoryItem {
  category: string;
  subcategory: string;
  url: string;
}

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.css'],
  standalone: false
})
export class HeaderMobileComponent implements OnInit {
  path: string = Path.url;
  categories: any[] = [];
  categoriesList: string[] = [];

  // subcategorías agrupadas por categoría
  subCategoriesByCategory: { [category: string]: SubCategoryItem[] } = {};

  // control de toggle (categorías abiertas)
  openCategories = new Set<string>();

  render: boolean = true;

  authValidate: boolean = false;
  picture: string;

  shoppingCart: ShoppingCartItem[] = [];
  totalShoppingCart: number = 0;

  // subtotal calculado en TS
  subTotalAmount: number = 0;

  renderShopping: boolean = true;

  lang: boolean = false;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly subCategoriesService: SubCategoriesService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // Idioma
    if (localStorage.getItem('yt-widget') == '{"lang":"es","active":true}') {
      this.lang = true;
    }

    // Usuario autenticado
    this.usersService.authActivate().then((resp) => {
      if (resp) {
        this.authValidate = true;

        this.usersService
          .getFilterData('idToken', localStorage.getItem('idToken') ?? '')
          .subscribe((resp: any) => {
            for (const i in resp) {
              if (resp[i].picture != undefined) {
                if (resp[i].method != 'direct') {
                  this.picture = `<img src="${resp[i].picture}" class="img-fluid rounded-circle ml-auto">`;
                } else {
                  this.picture = `<img src="assets/img/users/${resp[i].username.toLowerCase()}/${resp[i].picture}" class="img-fluid rounded-circle ml-auto">`;
                }
              } else {
                this.picture = `<i class="icon-user"></i>`;
              }
            }
          });
      }
    });

    // Categorías
    this.categoriesService.getData().subscribe((resp: any) => {
      for (const i in resp) {
        this.categories.push(resp[i]);
        this.categoriesList.push(resp[i].name);
      }

      // Cuando ya tenemos las categorías, cargamos subcategorías
      this.loadSubCategories();
    });

    // Carrito desde LocalStorage
    this.loadShoppingCartFromLocalStorage();
  }

  // ==========================
  //  BÚSQUEDA
  // ==========================
  goSearch(search: string) {
    if (search.length == 0 || Search.fnc(search) == undefined) {
      return;
    }

    window.open(`search/${Search.fnc(search)}`, '_top');
  }

  // ==========================
  // SUBCATEGORÍAS (sin jQuery)
  // ==========================

  private loadSubCategories(): void {
    // Creamos estructura vacía
    this.subCategoriesByCategory = {};
    this.categoriesList.forEach((category) => {
      this.subCategoriesByCategory[category] = [];
    });

    // Por cada categoría cargamos sus subcategorías
    this.categoriesList.forEach((category) => {
      this.subCategoriesService.getFilterData('category', category).subscribe((resp: any) => {
        const subcats: SubCategoryItem[] = [];

        for (const i in resp) {
          subcats.push({
            category: resp[i].category,
            subcategory: resp[i].name,
            url: resp[i].url
          });
        }

        this.subCategoriesByCategory[category] = subcats;
      });
    });
  }

  toggleCategory(category: string): void {
    if (this.openCategories.has(category)) {
      this.openCategories.delete(category);
    } else {
      this.openCategories.add(category);
    }
  }

  isCategoryOpen(category: string): boolean {
    return this.openCategories.has(category);
  }

  // callback() ya no necesita tocar el DOM, puedes incluso eliminarlo
  callback() {
    if (this.render) {
      this.render = false;
      // Si aún quieres asegurar que solo se ejecute una vez,
      // ya lo manejas con this.render, pero no es necesario hacer nada aquí.
    }
  }

  // ==========================
  // CARRITO (sin jQuery)
  // ==========================

  private loadShoppingCartFromLocalStorage(): void {
    const listStr = localStorage.getItem('list');
    if (!listStr) {
      return;
    }

    const list = JSON.parse(listStr);
    this.totalShoppingCart = list.length;

    for (const i in list) {
      this.productsService.getFilterData('url', list[i].product).subscribe((resp: any) => {
        for (const f in resp) {
          let details = `<div class="list-details small text-secondary">`;

          if (list[i].details.length > 0) {
            const specification = JSON.parse(list[i].details);
            for (const spec of specification) {
              const propertyNames = Object.keys(spec);
              for (const prop of propertyNames) {
                details += `<div>${prop}: ${spec[prop]}</div>`;
              }
            }
          } else {
            if (resp[f].specification != '') {
              const specification = JSON.parse(resp[f].specification);
              for (const spec of specification) {
                const property = Object.keys(spec).toString();
                details += `<div>${property}: ${spec[property][0]}</div>`;
              }
            }
          }

          details += `</div>`;

        // Precio y envío unitarios (ajusta según tu lógica real)
        //  const price = Number(DinamicPrice.fnc(resp[f])[0] ?? 0);
        const price = 100;//TODO 
        const shippingUnit = Number(resp[f].shipping ?? 0);
          const quantity = Number(list[i].unit ?? 1);

          const item: ShoppingCartItem = {
            url: resp[f].url,
            name: resp[f].name,
            category: resp[f].category,
            image: resp[f].image,
            delivery_time: resp[f].delivery_time,
            quantity,
            price,
            shipping: shippingUnit,
            details,
            listDetails: list[i].details
          };

          this.shoppingCart.push(item);
          this.calculateSubTotal();
        }
      });
    }
  }

  private calculateSubTotal(): void {
    this.subTotalAmount = this.shoppingCart.reduce((acc, item) => {
      const unitTotal = (item.price || 0) + (item.shipping || 0);
      return acc + unitTotal * (item.quantity || 0);
    }, 0);
  }

  // Si aún quieres usar callbackShopping para coordinar render, ya no lees el DOM
  callbackShopping() {
    if (this.renderShopping) {
      this.renderShopping = false;
      this.calculateSubTotal();
    }
  }

  // ==========================
  // REMOVER PRODUCTO
  // ==========================
  removeProduct(product: any, details: any) {
    const listStr = localStorage.getItem('list');
    if (!listStr) {
      return;
    }

    const shoppingCart = JSON.parse(listStr);

    const filtered = shoppingCart.filter(
      (list: any) => !(list.product === product && list.details == details.toString())
    );

    localStorage.setItem('list', JSON.stringify(filtered));

    // Actualizar array en memoria y subtotal
    this.shoppingCart = this.shoppingCart.filter(
      (x) => !(x.url === product && x.listDetails == details.toString())
    );
    this.totalShoppingCart = this.shoppingCart.length;
    this.calculateSubTotal();

    Sweetalert.fnc('success', 'product removed', this.router.url);
  }

  // ==========================
  // CAMBIO DE IDIOMA
  // ==========================
  changeLang(lang: string) {
    this.lang = lang === 'es';
    localStorage.setItem('yt-widget', `{"lang":"${lang}","active":true}`);
    window.open(window.location.href, '_top');
  }
}
