import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Path, Email } from '../../../config';
import {
  DinamicRating,
  DinamicReviews,
  CountDown,
  ProgressBar,
  Tooltip,
  Sweetalert,
  Share
} from '../../../functions';

import { ActivatedRoute, Router } from '@angular/router';

import { MessagesModel } from '../../../models/messages.model';

import { ProductsService } from '../../../services/products.service';
import { UsersService } from '../../../services/users.service';
import { MessagesService } from '../../../services/messages.service';
import { StoresService } from '../../../services/stores.service';

@Component({
  selector: 'app-product-left',
  templateUrl: './product-left.component.html',
  styleUrls: ['./product-left.component.css'],
  standalone: false
})
export class ProductLeftComponent implements OnInit {
  path: string = Path.url;
  product: any[] = [];
  rating: any[] = [];
  reviews: any[] = [];
  price: any[] = [];
  preload: boolean = false;
  render: boolean = true;
  countd: any[] = [];
  gallery: any[] = [];
  renderGallery: boolean = true;
  video: string = '';
  tags: any[] = [];
  totalReviews: string;
  offer: boolean = false;
  quantity: number = 1;
  summary: any[] = [];
  details: any[] = [];
  productDetails: any[] = [];
  selectedDetails: { [key: string]: string } = {};

  messages: MessagesModel;

  email: string = Email.url;

  questions: any[] = [];

  linkedin: string;

  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly messagesService: MessagesService,
    private readonly storesService: StoresService,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.messages = new MessagesModel();
  }

  ngOnInit(): void {
    this.preload = true;
    this.linkedin = window.location.href;

    this.productsService
      .getFilterData('url', this.activateRoute.snapshot.params['param'])
      .subscribe((resp) => {
        this.productsFnc(resp);
      });

    /*=============================================
        Traer preguntas y respuestas del producto
        =============================================*/
    this.messagesService
      .getFilterData('url_product', this.activateRoute.snapshot.params['param'])
      .subscribe((resp: any) => {
        if (Object.keys(resp).length > 0) {
          let count = 0;

          for (const i in resp) {
            count++;

            this.storesService.getFilterData('store', resp[i].receiver).subscribe((resp1: any) => {
              for (const f in resp1) {
                resp[i].store = resp1[f];
              }
            });

            this.usersService
              .getFilterData('username', resp[i].transmitter)
              .subscribe((resp1: any) => {
                for (const f in resp1) {
                  resp[i].user = resp1[f];
                }
              });

            let localQuestions = this.questions;

            setTimeout(function () {
              localQuestions.push(resp[i]);
            }, count * 1000);
          }
        }
      });
  }

  /*=============================================
	Declaramos función para mostrar los productos recomendados
	=============================================*/

  productsFnc(response:any) {
    this.product = [];

    /*=============================================
		Hacemos un recorrido por la respuesta que nos traiga el filtrado
		=============================================*/

    let i;
    let getProduct = [];

    for (i in response) {
      getProduct.push(response[i]);
    }

    /*=============================================
		Filtramos el producto
		=============================================*/

    getProduct.forEach((product, index) => {
      this.product.push(product);

      this.rating.push(DinamicRating.fnc(this.product[index]));

      this.reviews.push(DinamicReviews.fnc(this.rating[index]));

      // this.price.push(DinamicPrice.fnc(this.product[index]));

      this.summary.push(JSON.parse(this.product[index].summary));

      this.details.push(JSON.parse(this.product[index].details));

      this.generateProductDetails(this.product[index].specification);

      /*=============================================
    	Agregamos la fecha al descontador
    	=============================================*/

      if (this.product[index].offer != '') {
        let today = new Date();

        let offerDate = new Date(
          parseInt(JSON.parse(this.product[index].offer)[2].split('-')[0]),
          parseInt(JSON.parse(this.product[index].offer)[2].split('-')[1]) - 1,
          parseInt(JSON.parse(this.product[index].offer)[2].split('-')[2])
        );

        if (today < offerDate) {
          this.offer = true;

          const date = JSON.parse(this.product[index].offer)[2];

          this.countd.push(
            new Date(
              parseInt(date.split('-')[0]),
              parseInt(date.split('-')[1]) - 1,
              parseInt(date.split('-')[2])
            )
          );
        }
      }

      /*=============================================
      Gallery
      =============================================*/

      this.gallery.push(JSON.parse(this.product[index].gallery));

      /*=============================================
      Video
      =============================================*/

      if (JSON.parse(this.product[index].video).length > 0) {
        if (JSON.parse(this.product[index].video)[0] == 'youtube') {
          this.video = `https://www.youtube.com/embed/${JSON.parse(this.product[index].video)[1]}?rel=0&autoplay=0 `;
        }

        if (JSON.parse(this.product[index].video)[0] == 'vimeo') {
          this.video = `https://player.vimeo.com/video/${JSON.parse(this.product[index].video)[1]}`;
        }
      }

      /*=============================================
      Agregamos los tags
      =============================================*/

      this.tags = JSON.parse(this.product[index].tags);

      /*=============================================
      Total Reviews
      =============================================*/
      this.totalReviews = JSON.parse(this.product[index].reviews).length;

      this.preload = false;
    });
  }

  /*=============================================
    Generar detalles del producto desde especificación
    =============================================*/

  generateProductDetails(specification: string) {
    this.productDetails = [];

    if (specification && specification != '' && specification != '[{"": []}]') {
      const spec = JSON.parse(specification);

      spec.forEach((detail: any, index: number) => {
        const property = Object.keys(detail)[0];
        const options = detail[property];

        this.productDetails.push({
          property: property,
          index: index,
          options: options
        });
      });
    }
  }

  /*=============================================
    Seleccionar un detalle del producto
    =============================================*/

  selectDetail(property: string, value: string) {
    this.selectedDetails[property] = value;

    if (localStorage.getItem('details')) {
      let details = JSON.parse(localStorage.getItem('details') ?? '');
      for (const i in details) {
        details[i][property] = value;
        localStorage.setItem('details', JSON.stringify(details));
      }
    } else {
      localStorage.setItem('details', `[{"${property}":"${value}"}]`);
    }
  }

  /*=============================================
    Verificar si un detalle está seleccionado
    =============================================*/

  isDetailSelected(property: string, value: string): boolean {
    return this.selectedDetails[property] === value;
  }

  /*=============================================
    Función Callback()
    =============================================*/

  callback() {
    if (this.render) {
      this.render = false;

      // Rating.fnc() - eliminado
      CountDown.fnc();
      ProgressBar.fnc();
      // Tabs.fnc() - eliminado
      // Quantity.fnc() - eliminado
      Tooltip.fnc();
      Share.fnc();
    }
  }

  /*=============================================
    Función Callback Galería
    =============================================*/

  callbackGallery(i: any) {
    if (this.renderGallery) {
      this.renderGallery = false;
      // SlickConfig.fnc() - eliminado
      // ProductLightbox.fnc() - eliminado
    }
  }

  /*=============================================
    Función para agregar productos a la lista de deseos 
    =============================================*/

  addWishlist(product: any) {
    this.usersService.addWishlist(product);
  }

  /*=============================================
    Función cambio de cantidad
    =============================================*/

  changeQuantity(quantity: number, unit: any, move: any) {
    let number = 1;

    /*=============================================
        Controlar máximos y mínimos de la cantidad
        =============================================*/

    if (Number(quantity) > 9) {
      quantity = 9;
    }

    if (Number(quantity) < 1) {
      quantity = 1;
    }

    /*=============================================
        Modificar cantidad de acuerdo a la dirección
        =============================================*/

    if (move == 'up' && Number(quantity) < 9) {
      number = Number(quantity) + unit;
    } else if (move == 'down' && Number(quantity) > 1) {
      number = Number(quantity) - unit;
    } else {
      number = Number(quantity);
    }

    this.quantity = number;
  }

  /*=============================================
    Función para agregar productos al carrito de compras
    =============================================*/

  addShoppingCart(product:any, unit:any, details:any) {
    /*=============================================
        Preguntamos si existe detalles en localStorage
        =============================================*/

    if (localStorage.getItem('details')) {
      details = localStorage.getItem('details');
    }

    /*=============================================
        Agregar producto al carrito de compras
        =============================================*/

    let url = this.router.url;

    let item = {
      product: product,
      unit: this.quantity,
      details: details,
      url: url
    };

    localStorage.removeItem('details');

    this.usersService.addSoppingCart(item);
  }

  /*=============================================
    Función para agregar productos al carrito de compras
    =============================================*/

  buyNow(product: any, unit: any, details: any) {
    /*=============================================
        Preguntamos si existe detalles en localStorage
        =============================================*/

    if (localStorage.getItem('details')) {
      details = localStorage.getItem('details');
    }

    /*=============================================
        Agregar producto al carrito de compras
        =============================================*/

    let item = {
      product: product,
      unit: this.quantity,
      details: details,
      url: 'checkout'
    };

    localStorage.removeItem('details');

    this.usersService.addSoppingCart(item);
  }

  /*=============================================
    Función para crear nueva pregunta
    =============================================*/

  newQuestion(question: any, url: string, store: any) {
    this.messages.message = question.value;
    this.messages.url_product = url;
    this.messages.receiver = store;
    this.messages.date_message = new Date();

    /*=============================================
        Validar si este usuario está autenticado
        =============================================*/

    this.usersService.authActivate().then((resp) => {
      if (!resp) {
        Sweetalert.fnc('error', 'Please login to send your question', null);

        return;
      } else {
        /*=============================================
                Traer el correo de la tienda
                =============================================*/

        let emailStore: any = null;

        this.storesService.getFilterData('store', store).subscribe((res: any) => {
          for (const i in resp) {
            // emailStore = resp[i].email;
          }
        });

        /*=============================================
                Traer la información del usuario
                =============================================*/

        this.usersService
          .getFilterData('idToken', localStorage.getItem('idToken'))
          .subscribe((resp: any) => {
            for (const i in resp) {
              this.messages.transmitter = resp[i].username;

              /*=============================================
                        Crear el mensaje en la base de datos
                        =============================================*/

              this.messagesService
                .registerDatabase(this.messages)
                .subscribe(
                  (resp: any) => {
                    if (resp['name'] != '') {
                      /*=============================================
                                Enviar notificación por correo electrónico
                                =============================================*/

                      const formData = new FormData();

                      formData.append('email', 'yes');
                      formData.append('comment', 'You have received a new message');
                      formData.append('url', 'account/messages');
                      formData.append('address', emailStore);
                      formData.append('name', store);

                      this.http.post(this.email, formData).subscribe((resp: any) => {
                        if (resp['status'] == 200) {
                          Sweetalert.fnc('success', 'The message has been sent', 'product/' + url);
                        }
                      });
                    }
                  },
                  (err) => {
                    Sweetalert.fnc('error', err.error.error.message, null);
                  }
                );
            }
          });
      }
    });
  }
}
