import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { Rating, DinamicRating, DinamicReviews, DinamicPrice } from '../../../functions';

import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../services/products.service';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-similar-bought',
  templateUrl: './similar-bought.component.html',
  styleUrls: ['./similar-bought.component.css'],
  standalone: false
})
export class SimilarBoughtComponent implements OnInit {
  path: string = Path.url;
  products: any[] = [];
  rating: any[] = [];
  reviews: any[] = [];
  price: any[] = [];
  render: boolean = true;
  preload: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private productsService: ProductsService,
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.preload = true;

    this.productsService
      .getFilterData('url', this.activateRoute.snapshot.params['param'])
      .subscribe((resp) => {
        for (const i in resp) {
          this.productsService
            .getFilterData('sub_category', resp[i].sub_category)
            .subscribe((resp) => {
              this.productsFnc(resp);
            });
        }
      });
  }

  /*=============================================
	Declaramos función para mostrar los productos recomendados
	=============================================*/

  productsFnc(response:any) {
    this.products = [];

    /*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/

    let i;
    let getProduct = [];

    for (i in response) {
      getProduct.push(response[i]);
    }

    /*=============================================
		Ordenamos de mayor a menor views el arreglo de objetos
		=============================================*/

    getProduct.sort(function (a, b) {
      return b.views - a.views;
    });

    /*=============================================
		Filtramos el producto
		=============================================*/

    getProduct.forEach((product, index) => {
      if (index < 6) {
        this.products.push(product);

        /*=============================================
	        	Rating y Review
	        	=============================================*/

        this.rating.push(DinamicRating.fnc(this.products[index]));

        this.reviews.push(DinamicReviews.fnc(this.rating[index]));

        /*=============================================
	        	Price
	        	=============================================*/

        this.price.push(DinamicPrice.fnc(this.products[index]));

        this.preload = false;
      }
    });
  }

  callback() {
    if (this.render) {
      this.render = false;

      setTimeout(function () {
        Rating.fnc();
      }, 1000);
    }
  }

  /*=============================================
	Función para agregar productos a la lista de deseos	
	=============================================*/

  addWishlist(product:any) {
    this.usersService.addWishlist(product);
  }

  /*=============================================
	Función para agregar productos al carrito de compras
	=============================================*/

  addShoppingCart(product:any, unit:any, details:any) {
    let url = this.router.url;

    let item = {
      product: product,
      unit: unit,
      details: details,
      url: url
    };

    this.usersService.addSoppingCart(item);
  }
}
