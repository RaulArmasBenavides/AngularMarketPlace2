import { Component, OnInit, Input, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { Path, Server } from '../../../../config';
import { Sweetalert, Capitalize, CreateUrl } from '../../../../functions';

import { StoresService } from '../../../../services/stores.service';
import { UsersService } from '../../../../services/users.service';
import { ProductsService } from '../../../../services/products.service';
import { CategoriesService } from '../../../../services/categories.service';
import { SubCategoriesService } from '../../../../services/sub-categories.service';

import { StoresModel } from '../../../../models/stores.model';
import { ProductsModel } from '../../../../models/products.model';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-account-new-store',
  templateUrl: './account-new-store.component.html',
  styleUrls: ['./account-new-store.component.css'],
  standalone: false
})
export class AccountNewStoreComponent implements OnInit {
  @Input() childItem: any;

  path: string = Path.url;
  server: string = Server.url;

  /*=============================================
    Variable para aceptar términos y condiciones
    =============================================*/

  accept: boolean = false;

  /*=============================================
    Variable para saber que la creación de la tienda está lista
    =============================================*/

  storeOk: boolean = false;

  /*=============================================
    Variable para el modelo de tiendas y productos
    =============================================*/

  store: StoresModel;
  product: ProductsModel;

  /*=============================================
    Variable para el número indicativo del país
    =============================================*/

  dialCode: string = null;

  /*=============================================
    Variable para capturar el listado de paises
    =============================================*/

  countries: any = null;

  /*=============================================
    Variable de tipo objeto para redes sociales
    =============================================*/

  social: object = {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: ''
  };

  /*=============================================
    Variables de tipo arreglo para categorías y subcategorías
    =============================================*/

  categories: any[] = [];
  subcategories: any[] = [];

  /*=============================================
    Configuración inicial de Summernote 
    =============================================*/

  config = {
    placeholder: '',
    tabsize: 2,
    height: '400px',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['link', 'picture', 'hr']]
    ]
  };

  /*=============================================
    Variables de tipo arreglo con objeto para el resumen del producto
    =============================================*/

  summaryGroup: any[] = [
    {
      input: ''
    }
  ];

  /*=============================================
    Variables de tipo arreglo con objetos para los detalles del producto
    =============================================*/

  detailsGroup: any[] = [
    {
      title: '',
      value: ''
    }
  ];

  /*=============================================
    Variables de tipo arreglo con objetos para las especificaciones del producto
    =============================================*/

  specificationsGroup: any[] = [
    {
      type: '',
      values: ''
    }
  ];

  /*=============================================
    Variables de tipo arreglo para las palabras claves del producto
    =============================================*/

  tags: any[] = [];

  /*=============================================
    Variables de tipo arreglo para la galería del producto
    =============================================*/

  gallery: File[] = [];

  /*=============================================
    Variables de tipo objeto para el banner superior del producto
    =============================================*/

  topBanner: object = {
    'H3 tag': '',
    'P1 tag': '',
    'H4 tag': '',
    'P2 tag': '',
    'Span tag': '',
    'Button tag': '',
    'IMG tag': ''
  };

  /*=============================================
    Variables de tipo objeto para el slide horizontal del producto
    =============================================*/

  hSlider: object = {
    'H4 tag': '',
    'H3-1 tag': '',
    'H3-2 tag': '',
    'H3-3 tag': '',
    'H3-4s tag': '',
    'Button tag': '',
    'IMG tag': ''
  };

  /*=============================================
    Variables de tipo arreglo para el video del producto
    =============================================*/

  video: any[] = [];

  /*=============================================
    Variables de tipo arreglo para las ofertas del producto
    =============================================*/

  offer: any[] = [];

  /*=============================================
    Variables para almacenar los archivos de imagen de la tienda y del producto
    =============================================*/

  logoStore: File = null;
  coverStore: File = null;
  imageProduct: File = null;
  topBannerImg: File = null;
  defaultBannerImg: File = null;
  hSliderImg: File = null;
  vSliderImg: File = null;

  /*=============================================
    Constructor
    =============================================*/

  constructor(
    private storesService: StoresService,
    private usersService: UsersService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this.store = new StoresModel();
    this.product = new ProductsModel();
  }

  ngOnInit(): void {
    /*=============================================
        Validamos si el usuario ya tiene una tienda habilitada
        =============================================*/

    this.storesService.getFilterData('username', this.childItem).subscribe((resp) => {
      if (Object.keys(resp).length > 0) {
        window.open('account/my-store', '_top');
      } else {
        this.store.username = this.childItem;
        this.store.logo = `assets/img/stores/default/default-logo.jpg`;
        this.store.cover = `assets/img/stores/default/default-cover.jpg`;
      }
    });

    /*=============================================
        Traer la información del usuario existente
        =============================================*/

    this.usersService.getFilterData('username', this.childItem).subscribe((resp) => {
      for (const i in resp) {
        this.store.email = resp[i].email;
        this.store.country = resp[i].country;
        this.store.city = resp[i].city;
        this.store.address = resp[i].address;

        /*=============================================
                Dar formato al número teléfonico
                =============================================*/

        if (resp[i].phone != undefined) {
          this.store.phone = resp[i].phone.split('-')[1];
          this.dialCode = resp[i].phone.split('-')[0];
        }

        /*=============================================
                Traer listado de países
                =============================================*/

        this.usersService.getCountries().subscribe((resp) => {
          this.countries = resp;
        });
      }
    });
  }

  /*=============================================
    Mover el Scroll hasta donde inicia términos y condiciones
    =============================================*/

  goTerms() {
    $('html, body').animate({
      scrollTop: $('#tabContent').offset().top - 50
    });
  }

  /*=============================================
    Función que avisa si Acepta términos y condiciones
    =============================================*/

  changeAccept() {
    if (this.accept) {
      $('#createStore').tab('show');

      /*=============================================
            Mover el scroll hasta la creación de la tienda
            =============================================*/

      $('html, body').animate({
        scrollTop: $('#createStore').offset().top - 100
      });
    } else {
      $('#createStore').removeClass('active');
    }
  }

  /*=============================================
    Activar módulo para crear producto
    =============================================*/

  createProduct() {
    /*=============================================
        Validar que la tienda esté correctamente creada
        =============================================*/

    let formStore = $('.formStore');

    let error = 0;

    for (let i = 0; i < formStore.length; i++) {
      if ($(formStore[i]).val() == '' || $(formStore[i]).val() == undefined) {
        error++;

        $(formStore[i]).parent().addClass('was-validated');
      }
    }

    if (error > 0) {
      return;
    }

    this.storeOk = true;

    /*=============================================
        Cuando se activa el módulo para crear el producto
        =============================================*/

    if (this.storeOk) {
      $('#createProduct').tab('show');

      /*=============================================
            Mover el scroll hasta la creación de la tienda
            =============================================*/

      $('html, body').animate({
        scrollTop: $('#createProduct').offset().top - 100
      });

      /*=============================================
            Traer data de categorías
            =============================================*/

      this.categoriesService.getData().subscribe((resp) => {
        for (const i in resp) {
          this.categories.push(resp[i]);
        }
      });

      /*=============================================
            Agregar imagen del producto por defecto
            =============================================*/

      this.product.image = `assets/img/products/default/default-image.jpg`;

      /*=============================================
            Agregar Imagen Banner Top por defecto
            =============================================*/

      this.topBanner['IMG tag'] = `assets/img/products/default/default-top-banner.jpg`;

      /*=============================================
            Agregar Imagen Banner Default por defecto
            =============================================*/

      this.product.default_banner = `assets/img/products/default/default-banner.jpg`;

      /*=============================================
            Agregar Imagen Slide Horizontal por defecto
            =============================================*/

      this.hSlider['IMG tag'] = `assets/img/products/default/default-horizontal-slider.jpg`;

      /*=============================================
            Agregar Imagen Slide Vertical por defecto
            =============================================*/

      this.product.vertical_slider = `assets/img/products/default/default-vertical-slider.jpg`;
    }
  }

  /*=============================================
    Validación extra para cada campo del formulario
    =============================================*/

  validate(input) {
    /*=============================================
        Validamos el nombre de la tienda
        =============================================*/

    if ($(input).attr('name') == 'storeName' || $(input).attr('name') == 'productName') {
      /*=============================================
            Validamos expresión regular del nombre de la tienda
            =============================================*/

      let pattern = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        input.value = '';

        return;
      } else {
        if ($(input).attr('name') == 'storeName') {
          /*=============================================
                    Validamos que el nombre de la tienda no esté repetido
                    =============================================*/

          this.storesService.getFilterData('store', input.value).subscribe((resp) => {
            if (Object.keys(resp).length > 0) {
              $(input).parent().addClass('was-validated');
              input.value = '';
              this.store.url = '';

              Sweetalert.fnc('error', 'Store name already exists', null);

              return;
            } else {
              /*=============================================
                            Capitulamos el nombre de la tienda
                            =============================================*/

              input.value = Capitalize.fnc(input.value);

              /*=============================================
                            Creamos la URL de la tienda
                            =============================================*/

              this.store.url = CreateUrl.fnc(input.value);
            }
          });
        } else {
          /*=============================================
                    Validamos que el nombre de la tienda no esté repetido
                    =============================================*/

          this.productsService.getFilterData('name', input.value).subscribe((resp) => {
            if (Object.keys(resp).length > 0) {
              $(input).parent().addClass('was-validated');
              input.value = '';
              this.product.url = '';

              Sweetalert.fnc('error', 'Product name already exists', null);

              return;
            } else {
              /*=============================================
                            Capitulamos el nombre de la tienda
                            =============================================*/

              input.value = Capitalize.fnc(input.value);

              /*=============================================
                            Creamos la URL de la tienda
                            =============================================*/

              this.product.url = CreateUrl.fnc(input.value);
            }
          });
        }
      }
    }

    /*=============================================
        Validamos la información de la tienda
        =============================================*/

    if ($(input).attr('name') == 'storeAbout') {
      /*=============================================
            Validamos expresión regular de la información de la tienda
            =============================================*/

      let pattern =
        /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        input.value = '';

        return;
      } else {
        this.store.abstract = input.value.substr(0, 100) + '...';
      }
    }

    /*=============================================
        Validamos la ciudad de la tienda
        =============================================*/

    if ($(input).attr('name') == 'storeCity') {
      /*=============================================
            Validamos expresión regular de la ciudad de la tienda
            =============================================*/

      let pattern = /^[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        input.value = '';

        return;
      }
    }

    /*=============================================
        Validamos el teléfono de la tienda
        =============================================*/

    if ($(input).attr('name') == 'storePhone') {
      /*=============================================
            Validamos expresión regular del teléfono de la tienda
            =============================================*/

      let pattern = /^[-\\0-9 ]{1,}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        input.value = '';

        return;
      }
    }

    /*=============================================
        Validamos la dirección de la tienda
        =============================================*/

    if ($(input).attr('name') == 'storeAddress') {
      /*=============================================
            Validamos expresión regular de la dirección de la tienda
            =============================================*/

      let pattern =
        /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,1000}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        input.value = '';

        return;
      }
    }

    /*=============================================
        Validamos las redes sociales de la tienda
        =============================================*/

    if ($(input).attr('social') == 'socialNetwork') {
      /*=============================================
            Validamos expresión regular de la dirección de la tienda
            =============================================*/

      let pattern = /^[-\\_\\.\\0-9a-zA-Z]{1,}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        // input.value = "";

        return;
      }
    }

    /*=============================================
        Validamos los TAGS de los Banner's y Slider's
        =============================================*/

    if ($(input).attr('tags') == 'tags') {
      /*=============================================
            Validamos expresión regular
            =============================================*/

      let pattern =
        /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\'\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,50}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        input.value = '';

        return;
      }
    }

    /*=============================================
        Validamos el video del producto
        =============================================*/

    if ($(input).attr('name') == 'id_video') {
      /*=============================================
            Validamos expresión regular
            =============================================*/

      let pattern =
        /^[-\\(\\)\\=\\%\\&\\$\\;\\_\\*\\"\\#\\?\\¿\\!\\¡\\:\\,\\.\\0-9a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,100}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        return;
      }
    }

    /*=============================================
        Validamos el precio de envío y el precio de venta
        =============================================*/

    if ($(input).attr('tags') == 'prices') {
      /*=============================================
            Validamos expresión regular
            =============================================*/

      let pattern = /^[.\\,\\0-9]{1,}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        return;
      }
    }

    /*=============================================
        Validamos dias de entrega y stock
        =============================================*/

    if ($(input).attr('tags') == 'intNumber') {
      /*=============================================
            Validamos expresión regular
            =============================================*/

      let pattern = /^[0-9]{1,}$/;

      if (!pattern.test(input.value)) {
        $(input).parent().addClass('was-validated');

        return;
      } else {
        if ($(input).attr('name') == 'stock' && input.value > 100) {
          input.value = '';

          Sweetalert.fnc('error', 'The product exceeds 100 units', null);

          return;
        }
      }
    }
  }

  /*=============================================
    Validación para las imágenes del formulario
    =============================================*/

  validateImage(e, tagPicture) {
    switch (tagPicture) {
      case 'changeLogo':
        this.logoStore = e.target.files[0];
        break;

      case 'changeCover':
        this.coverStore = e.target.files[0];
        break;

      case 'changeImage':
        this.imageProduct = e.target.files[0];
        break;

      case 'changeTopBanner':
        this.topBannerImg = e.target.files[0];
        break;

      case 'changeDefaultBanner':
        this.defaultBannerImg = e.target.files[0];
        break;

      case 'changeHSlider':
        this.hSliderImg = e.target.files[0];
        break;

      case 'changeVSlider':
        this.vSliderImg = e.target.files[0];
        break;
    }

    let image = e.target.files[0];

    /*=============================================
        Validamos el formato
        =============================================*/

    if (image['type'] !== 'image/jpeg' && image['type'] !== 'image/png') {
      Sweetalert.fnc('error', 'The image must be in JPG or PNG format', null);

      return;
    } else if (image['size'] > 2000000) {

    /*=============================================
        Validamos el tamaño
        =============================================*/
      Sweetalert.fnc('error', 'Image must not weigh more than 2MB', null);

      return;
    } else {

    /*=============================================
        Mostramos la imagen temporal
        =============================================*/
      let data = new FileReader();
      data.readAsDataURL(image);

      $(data).on('load', function (event) {
        let path = event.target.result;

        $(`.${tagPicture}`).attr('src', path);
      });
    }
  }

  /*=============================================
    Agregar código dial al input telefónico
    =============================================*/

  changeCountry(input) {
    this.countries.forEach((country) => {
      if (input.value == country.name) {
        this.dialCode = country.dial_code;
      }
    });
  }

  /*=============================================
    Traer la data de subcategorías de acuerdo a la categoría seleccionada
    =============================================*/

  changeCategory(input) {
    let category = input.value.split('_')[0];

    this.subCategoriesService.getFilterData('category', category).subscribe((resp) => {
      this.subcategories = [];

      for (const i in resp) {
        this.subcategories.push(resp[i]);
      }
    });
  }

  /*=============================================
    Adicionar Input's de forma dinámica
    =============================================*/

  addInput(type) {
    if (type == 'summary') {
      if (this.summaryGroup.length < 5) {
        this.summaryGroup.push({
          input: ''
        });
      } else {
        Sweetalert.fnc('error', 'Entry limit has been exceeded', null);
      }
    }

    if (type == 'details') {
      if (this.detailsGroup.length < 10) {
        this.detailsGroup.push({
          title: '',
          value: ''
        });
      } else {
        Sweetalert.fnc('error', 'Entry limit has been exceeded', null);
      }
    }

    if (type == 'specifications') {
      if (this.specificationsGroup.length < 5) {
        this.specificationsGroup.push({
          type: '',
          values: ''
        });
      } else {
        Sweetalert.fnc('error', 'Entry limit has been exceeded', null);
      }
    }
  }

  /*=============================================
    Quitar Input's de forma dinámica
    =============================================*/

  removeInput(i, type) {
    if (i > 0) {
      if (type == 'summary') {
        this.summaryGroup.splice(i, 1);
      }

      if (type == 'details') {
        this.detailsGroup.splice(i, 1);
      }

      if (type == 'specifications') {
        this.specificationsGroup.splice(i, 1);
      }
    }
  }

  /*=============================================
    Funciones de Dropzone
    =============================================*/

  onSelect(event) {
    this.gallery.push(...event.addedFiles);
  }

  onRemove(event) {
    this.gallery.splice(this.gallery.indexOf(event), 1);
  }

  /*=============================================
    Envío del formulario
    =============================================*/

  onSubmit(f: NgForm) {
    this.ngZone.runOutsideAngular(() => {
      console.log('f', f);

      /*=============================================
            Validar que el producto esté correctamente creado
            =============================================*/

      let formProduct = $('.formProduct');

      let error = 0;

      for (let i = 0; i < formProduct.length; i++) {
        if ($(formProduct[i]).val() == '' || $(formProduct[i]).val() == undefined) {
          error++;

          $(formProduct[i]).parent().addClass('was-validated');
        }
      }

      /*=============================================
            Validamos que las palabras claves tenga como mínimo una sola palabra
            =============================================*/

      if (this.tags.length == 0) {
        Sweetalert.fnc('error', 'Product Tags is empty', null);

        return;
      }

      /*=============================================
            Validamos que la galería tenga como mínimo una sola imagen
            =============================================*/

      if (this.gallery.length == 0) {
        Sweetalert.fnc('error', 'Product Gallery is empty', null);

        return;
      }

      /*=============================================
            Validación completa del formulario
            =============================================*/

      if (f.invalid) {
        Sweetalert.fnc('error', 'Invalid Request', null);

        return;
      }

      /*=============================================
            Alerta suave mientras se registra la tienda y el producto
            =============================================*/

      Sweetalert.fnc('loading', 'Loading...', null);

      /*=============================================
            Subir imagenes al servidor
            =============================================*/
      let countAllImages = 0;

      let allImages = [
        {
          type: 'logoStore',
          file: this.logoStore,
          folder: this.store.url,
          path: 'stores',
          width: '270',
          height: '270'
        },
        {
          type: 'coverStore',
          file: this.coverStore,
          folder: this.store.url,
          path: 'stores',
          width: '1424',
          height: '768'
        },
        {
          type: 'imageProduct',
          file: this.imageProduct,
          folder: this.product.category.split('_')[1],
          path: 'products',
          width: '300',
          height: '300'
        },
        {
          type: 'topBannerImg',
          file: this.topBannerImg,
          folder: `${this.product.category.split('_')[1]}/top`,
          path: 'products',
          width: '1920',
          height: '80'
        },
        {
          type: 'defaultBannerImg',
          file: this.defaultBannerImg,
          folder: `${this.product.category.split('_')[1]}/default`,
          path: 'products',
          width: '570',
          height: '210'
        },
        {
          type: 'hSliderImg',
          file: this.hSliderImg,
          folder: `${this.product.category.split('_')[1]}/horizontal`,
          path: 'products',
          width: '1920',
          height: '358'
        },
        {
          type: 'vSliderImg',
          file: this.vSliderImg,
          folder: `${this.product.category.split('_')[1]}/vertical`,
          path: 'products',
          width: '263',
          height: '629'
        }
      ];

      for (const i in allImages) {
        const formData = new FormData();

        formData.append('file', allImages[i].file);
        formData.append('folder', allImages[i].folder);
        formData.append('path', allImages[i].path);
        formData.append('width', allImages[i].width);
        formData.append('height', allImages[i].height);

        this.http.post(this.server, formData).subscribe((resp) => {
          if (resp['status'] == 200) {
            switch (allImages[i].type) {
              case 'logoStore':
                this.store.logo = resp['result'];
                break;

              case 'coverStore':
                this.store.cover = resp['result'];
                break;

              case 'imageProduct':
                this.product.image = resp['result'];
                break;

              case 'topBannerImg':
                this.topBanner['IMG tag'] = resp['result'];
                break;

              case 'defaultBannerImg':
                this.product.default_banner = resp['result'];
                break;

              case 'hSliderImg':
                this.hSlider['IMG tag'] = resp['result'];
                break;

              case 'vSliderImg':
                this.product.vertical_slider = resp['result'];
                break;
            }

            countAllImages++;

            /*=============================================
                        Preguntamos cuando termina de subir todas las imágenes
                        =============================================*/

            if (countAllImages == allImages.length) {
              /*=============================================
                            Subir galería al servidor
                            =============================================*/
              let countGallery = 0;
              let newGallery = [];

              for (const i in this.gallery) {
                const formData = new FormData();

                formData.append('file', this.gallery[i]);
                formData.append('folder', `${this.product.category.split('_')[1]}/gallery`);
                formData.append('path', 'products');
                formData.append('width', '1000');
                formData.append('height', '1000');

                this.http.post(this.server, formData).subscribe((resp) => {
                  if (resp['status'] == 200) {
                    newGallery.push(resp['result']);

                    this.product.gallery = JSON.stringify(newGallery);

                    countGallery++;

                    /*=============================================
                                        Preguntamos cuando termina de subir toda la galería
                                        =============================================*/
                    if (countGallery == this.gallery.length) {
                      /*=============================================
                                            Consolidar número telefónico de la tienda
                                            =============================================*/

                      this.store.phone = `${this.dialCode}-${this.store.phone}`;

                      /*=============================================
                                            Consolidar cantidad de productos para la tienda
                                            =============================================*/

                      this.store.products = 1;

                      /*=============================================
                                            Consolidar redes sociales para la tienda
                                            =============================================*/

                      for (const i in Object.keys(this.social)) {
                        if (this.social[Object.keys(this.social)[i]] != '') {
                          this.social[Object.keys(this.social)[i]] =
                            `https://${Object.keys(this.social)[i]}.com/${this.social[Object.keys(this.social)[i]]}`;
                        }
                      }

                      this.store.social = JSON.stringify(this.social);
                      this.store.date = new Date();

                      /*=============================================
                                            Consolidar fecha de creación del producto   
                                            =============================================*/

                      this.product.date_created = new Date();

                      /*=============================================
                                            Consolidar el feedback para el producto
                                            =============================================*/

                      this.product.feedback = {
                        type: 'review',
                        comment: 'Your product is under review'
                      };

                      this.product.feedback = JSON.stringify(this.product.feedback);

                      /*=============================================
                                            Consolidar categoria para el producto
                                            =============================================*/

                      this.product.category = this.product.category.split('_')[1];

                      /*=============================================
                                            Consolidar lista de títulos para el producto
                                            =============================================*/

                      this.product.title_list = this.product.sub_category.split('_')[1];

                      /*=============================================
                                            Consolidar sub-categoria para el producto
                                            =============================================*/

                      this.product.sub_category = this.product.sub_category.split('_')[0];

                      /*=============================================
                                            Consolidar el nombre de la tienda para el producto
                                            =============================================*/

                      this.product.store = this.store.store;

                      /*=============================================
                                            Consolidar calificaciones para el producto
                                            =============================================*/

                      this.product.reviews = '[]';

                      /*=============================================
                                            Consolidar las ventas y las vistas del producto
                                            =============================================*/

                      this.product.sales = 0;
                      this.product.views = 0;

                      /*=============================================
                                            Consolidar resumen del producto 
                                            =============================================*/

                      let newSummary = [];

                      for (const i in this.summaryGroup) {
                        newSummary.push(this.summaryGroup[i].input);
                        this.product.summary = JSON.stringify(newSummary);
                      }

                      /*=============================================
                                            Consolidar detalles del producto
                                            =============================================*/

                      this.product.details = JSON.stringify(this.detailsGroup);

                      /*=============================================
                                            Consolidar especificaciones del producto
                                            =============================================*/

                      if (Object.keys(this.specificationsGroup).length > 0) {
                        let newSpecifications = [];

                        for (const i in this.specificationsGroup) {
                          let newValue = [];

                          for (const f in this.specificationsGroup[i].values) {
                            newValue.push(`'${this.specificationsGroup[i].values[f].value}'`);
                          }

                          newSpecifications.push(
                            `{'${this.specificationsGroup[i].type}':[${newValue}]}`
                          );
                        }

                        this.product.specification = JSON.stringify(newSpecifications);
                        this.product.specification = this.product.specification.replace(/["]/g, '');
                        this.product.specification = this.product.specification.replace(
                          /[']/g,
                          '"'
                        );
                      } else {
                        this.product.specification = '';
                      }

                      /*=============================================
                                             Consolidar palabras claves para el producto
                                            =============================================*/
                      let newTags = [];

                      for (const i in this.tags) {
                        newTags.push(this.tags[i].value);
                      }

                      this.product.tags = JSON.stringify(newTags).toLowerCase();

                      /*=============================================
                                            Consolidar Top Banner del producto
                                            =============================================*/

                      this.product.top_banner = JSON.stringify(this.topBanner);

                      /*=============================================
                                            Consolidar Horizontal Slider del producto
                                            =============================================*/

                      this.product.horizontal_slider = JSON.stringify(this.hSlider);

                      /*=============================================
                                            Consolidar Video del producto
                                            =============================================*/

                      this.product.video = JSON.stringify(this.video);

                      /*=============================================
                                            Consolidar Oferta
                                            =============================================*/

                      if (this.offer.length > 0) {
                        this.product.offer = JSON.stringify(this.offer);
                      } else {
                        this.product.offer = '[]';
                      }

                      /*=============================================
                                            Crear la tienda en la BD
                                            =============================================*/

                      this.storesService
                        .registerDatabase(this.store, localStorage.getItem('idToken'))
                        .subscribe(
                          (resp) => {
                            if (resp['name'] != '') {
                              /*=============================================
                                                    Crear el producto en la BD
                                                    =============================================*/

                              this.productsService
                                .registerDatabase(this.product, localStorage.getItem('idToken'))
                                .subscribe(
                                  (resp) => {
                                    if (resp['name'] != '') {
                                      Sweetalert.fnc(
                                        'success',
                                        'The store and product was successful',
                                        'account/my-store'
                                      );
                                    }
                                  },
                                  (err) => {
                                    Sweetalert.fnc('error', err.error.error.message, null);
                                  }
                                );
                            }
                          },
                          (err) => {
                            Sweetalert.fnc('error', err.error.error.message, null);
                          }
                        );
                    }
                  }
                });
              }
            }
          }
        });
      }
    });
  }
}
