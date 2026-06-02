import { Component, OnInit } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Path } from '../../../config';

import {
  DinamicRating,
  DinamicReviews,
  DinamicPrice
} from '../../../functions';

import { ProductsService } from '../../../services/products.service';
import { UsersService } from '../../../services/users.service';

import { ActivatedRoute, Router } from '@angular/router';

register();

@Component({
  selector: 'app-products-recommended',
  templateUrl: './products-recommended.component.html',
  styleUrls: ['./products-recommended.component.css'],
  standalone: false
})
export class ProductsRecommendedComponent implements OnInit {
  path: string = Path.url;
  recommendedItems: any[] = [];
  render: boolean = true;
  rating: any[] = [];
  reviews: any[] = [];
  price: any[] = [];
  preload: boolean = false;
  placeholder: any[] = [0, 1, 2, 3, 4, 5];
  notFound: boolean = false;

  swiperConfig: any = {
    slidesPerView: 6,
    spaceBetween: 30,
    navigation: false,
    pagination: false,
    autoplay: { delay: 10000, disableOnInteraction: false },
    loop: true,
    speed: 1000,
    breakpoints: {
      320: { slidesPerView: 2 },
      576: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      992: { slidesPerView: 4 },
      1200: { slidesPerView: 6 }
    }
  };

  constructor(
    private readonly productsService: ProductsService,
    private readonly activateRoute: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.preload = true;

    /*=============================================
		Capturamos el parámetro URL
		=============================================*/

    let params = this.activateRoute.snapshot.params['param'].split('&')[0];

    /*=============================================
		Filtramos data de productos con categorías
		=============================================*/

    this.productsService.getFilterData('category', params).subscribe((resp1:any) => {
      if (Object.keys(resp1).length > 0) {
        this.productsFnc(resp1);
      } else {
        /*=============================================
				Filtramos data de subategorías
				=============================================*/

        this.productsService.getFilterData('sub_category', params).subscribe((resp2: any) => {
          if (Object.keys(resp2).length > 0) {
            this.productsFnc(resp2);
          } else {
            this.preload = false;
            this.notFound = true;
          }
        });
      }
    });
  }

  /*=============================================
	Declaramos función para mostrar los productos recomendados
	=============================================*/

  productsFnc(response: any) {
    this.recommendedItems = [];

    /*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/

    let i;
    let getSales = [];

    for (i in response) {
      getSales.push(response[i]);
    }

    /*=============================================
		Ordenamos de mayor a menor ventas el arreglo de objetos
		=============================================*/

    getSales.sort(function (a, b) {
      return b.views - a.views;
    });

    /*=============================================
		Filtramos solo hasta 10 productos
		=============================================*/

    getSales.forEach((product, index) => {
      if (index < 10) {
        this.recommendedItems.push(product);

        this.rating.push(DinamicRating.fnc(this.recommendedItems[index]));

        this.reviews.push(DinamicReviews.fnc(this.rating[index]));

        // this.price.push(DinamicPrice.fnc(this.recommendedItems[index]));

        this.preload = false;

        setTimeout(function () {
          // Rating.fnc() - eliminado
        }, index * 100);
      }
    });
  }

  /*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/

  callback() {
    if (this.render) {
      this.render = false;
    }
  }

  /*=============================================
	Función para agregar productos a la lista de deseos	
	=============================================*/

  addWishlist(product: any) {
    this.usersService.addWishlist(product);
  }

  /*=============================================
	Función para agregar productos al carrito de compras
	=============================================*/

  addShoppingCart(product: any, unit: any, details: any) {
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
