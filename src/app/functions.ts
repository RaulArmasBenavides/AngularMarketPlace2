/* eslint-disable @typescript-eslint/no-explicit-any */

// Declaraciones globales necesarias para librerías no tipadas
// Reemplaza con @types/ si están disponibles en tu proyecto

declare var $: any;
declare var Swal: any;
declare var paypal: any;
declare var Chart: any;
declare var shapeShare: any;

export const OwlCarouselConfig = {
  fnc(): void {
    const target = $('.owl-slider');
    if (target.length > 0) {
      target.each(function (this: HTMLElement) {
        const el = $(this);
        const duration = el.data('owl-duration');
        if (target.children('div, span, a, img, h1, h2, h3, h4, h5').length >= 1) {
          el.owlCarousel({
            animateIn: el.data('owl-animate-in') || '',
            animateOut: el.data('owl-animate-out') || '',
            margin: el.data('owl-gap'),
            autoplay: el.data('owl-auto'),
            autoplayTimeout: el.data('owl-speed'),
            autoplayHoverPause: true,
            loop: el.data('owl-loop'),
            nav: el.data('owl-nav'),
            mouseDrag: el.data('owl-mousedrag') === 'on',
            touchDrag: true,
            autoplaySpeed: duration,
            navSpeed: duration,
            dotsSpeed: duration,
            dragEndSpeed: duration,
            navText: [
              el.data('owl-nav-left') || "<i class='icon-chevron-left'></i>",
              el.data('owl-nav-right') || "<i class='icon-chevron-right'></i>"
            ],
            dots: el.data('owl-dots'),
            items: el.data('owl-item'),
            responsive: {
              0: { items: el.data('owl-item-xs') },
              480: { items: el.data('owl-item-sm') },
              768: { items: el.data('owl-item-md') },
              992: { items: el.data('owl-item-lg') },
              1200: { items: el.data('owl-item-xl') },
              1680: { items: el.data('owl-item') }
            }
          });
        }
      });
    }
  }
};

export const BackgroundImage = {
  fnc(): void {
    $('[data-background]').each(function (this: HTMLElement) {
      const el = $(this);
      const imagePath = el.attr('data-background');
      if (imagePath) {
        el.css('background', `url(${imagePath})`);
      }
    });
  }
};

export const Capitalize = {
  fnc(value: string): string {
    const words = value.toLowerCase().split(' ');
    return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
  }
};

export const Sweetalert = {
  fnc(type: string, text: string, url: string | null = null): void {
    const config: any = {
      icon: type,
      title: type === 'success' ? 'Success' : 'Error',
      text
    };

    if (type === 'error' || type === 'success') {
      if (url) {
        Swal.fire(config).then((result: any) => {
          if (result.value) {
            window.open(url, '_top');
          }
        });
      } else {
        Swal.fire(config);
      }
    } else if (type === 'loading') {
      Swal.fire({ allowOutsideClick: false, icon: 'info', text });
      Swal.showLoading();
    } else if (type === 'close') {
      Swal.close();
    } else if (type === 'html') {
      Swal.fire({
        allowOutsideClick: false,
        title: 'Click to continue with the payment...',
        icon: 'info',
        html: text,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonColor: '#d33'
      });
    }
  }
};

export const Paypal = {
  fnc(price: number): Promise<boolean> {
    return new Promise((resolve) => {
      paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{ amount: { value: price } }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              if (details.status === 'COMPLETED') {
                localStorage.setItem('id_payment', details.id);
                resolve(true);
              }
            });
          },
          onCancel: () => resolve(false),
          onError: () => resolve(false)
        })
        .render('#paypal-button-container');
    });
  }
};

export const CreateUrl = {
  fnc(value: string): string {
    return value
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[á]/g, 'a')
      .replace(/[é]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[ó]/g, 'o')
      .replace(/[ú]/g, 'u')
      .replace(/[ñ]/g, 'n');
  }
};

export const Search = {
  fnc(response: string): string | undefined {
    const search = response.toLowerCase();
    const match = /^[a-z0-9ñÑáéíóú ]*$/;
    if (match.test(search)) {
      return search
        .replace(/ /g, '_')
        .replace(/ñ/g, 'n')
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u');
    }
  }
};

export const Tabs = {
  fnc(): void {
    $('.ps-tab-list  li > a ').on('click', function (this: HTMLElement,e: Event) {
      e.preventDefault();
      const target = $(this).attr('href');
      $(this).closest('li').siblings('li').removeClass('active');
      $(this).closest('li').addClass('active');
      $(target).addClass('active').siblings('.ps-tab').removeClass('active');
    });

    $('.ps-tab-list.owl-slider .owl-item a').on('click', function (this: HTMLElement,e: Event) {
      e.preventDefault();
      const target = $(this).attr('href');
      $(this).closest('.owl-item').siblings('.owl-item').removeClass('active');
      $(this).closest('.owl-item').addClass('active');
      $(target).addClass('active').siblings('.ps-tab').removeClass('active');
    });
  }
};

export class CarouselNavigation {
  static init(): void {
    const prevBtns = document.querySelectorAll<HTMLAnchorElement>('.ps-carousel__prev');
    const nextBtns = document.querySelectorAll<HTMLAnchorElement>('.ps-carousel__next');

    prevBtns.forEach((btn) => {
      btn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const targetSelector = btn.getAttribute('href');
        if (targetSelector) {
          const target = document.querySelector<HTMLElement>(targetSelector);
          if (target) {
            (target as any).dispatchEvent(new CustomEvent('prev.owl.carousel', { detail: [1000] }));
          }
        }
      });
    });

    nextBtns.forEach((btn) => {
      btn.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const targetSelector = btn.getAttribute('href');
        if (targetSelector) {
          const target = document.querySelector<HTMLElement>(targetSelector);
          if (target) {
            (target as any).dispatchEvent(new CustomEvent('next.owl.carousel', { detail: [1000] }));
          }
        }
      });
    });
  }
}

export interface ProductResponse {
  price: number;
  stock: number;
  offer: string; // JSON string: '["Disccount", 20, "2025-12-31"]'
}

export class DinamicPrice {
  static getPrice(response: ProductResponse): [string, string?] {
    let type: string;
    let value: number;
    let offerPrice: string | undefined;
    let priceHtml: string;
    let discountBadge: string | undefined;
    const today = new Date();

    if (response.offer) {
      try {
        const [offerType, offerValue, offerEndDate] = JSON.parse(response.offer);
        const offerDate = new Date(offerEndDate);

        if (today < offerDate) {
          type = offerType;
          value = Number(offerValue);

          if (type === 'Disccount') {
            const discounted = response.price - (response.price * value) / 100;
            offerPrice = discounted.toFixed(2);
          }

          if (type === 'Fixed') {
            offerPrice = value.toFixed(2);
            value = Math.round((value * 100) / response.price);
          }

          discountBadge = `<div class="ps-product__badge">-${value}%</div>`;
          priceHtml = `<p class="ps-product__price sale">$<span class="end-price">${offerPrice}</span> <del>$${response.price.toFixed(2)}</del></p>`;
        } else {
          priceHtml = `<p class="ps-product__price">$<span class="end-price">${response.price.toFixed(2)}</span></p>`;
        }
      } catch (error) {
        console.error('Invalid offer format:', error);
        priceHtml = `<p class="ps-product__price">$<span class="end-price">${response.price.toFixed(2)}</span></p>`;
      }
    } else {
      priceHtml = `<p class="ps-product__price">$<span class="end-price">${response.price.toFixed(2)}</span></p>`;
    }

    if (response.stock === 0) {
      discountBadge = `<div class="ps-product__badge out-stock">Out Of Stock</div>`;
    }

    return [priceHtml, discountBadge];
  }
}

export const DinamicRating = {
  fnc(product: any): number {
    try {
      const reviews: Array<{ review: number }> = JSON.parse(product?.reviews ?? '[]');
      if (!reviews.length) return 0;
      const sum = reviews.reduce((acc, r) => acc + Number(r.review || 0), 0);
      const avg = sum / reviews.length;
      return Math.round(avg); // lo que tu componente usa como "this.rating[0]"
    } catch {
      return 0;
    }
  }
};

/** Devuelve la lista de opciones permitidas para “reviews” (1..5) */
export const DinamicReviews = {
  fnc(_: number): number[] {
    // Si en el futuro quieres condicionar por rating promedio, lo tienes aquí.
    return [1, 2, 3, 4, 5];
  }
};

/** Aplica efectos visuales: setea widths de .ps-progress y selecciona <select [reviews]> */
export const Rating = {
  fnc(): void {
    // Barra de progreso de estrellas (usa data-value="%" que ya construyes en el componente)
    $('.ps-progress').each(function (this: HTMLElement) {
      const val = Number($(this).data('value') || 0);
      $(this).find('span').css('width', `${val}%`);
    });

    // Selects con atributo [reviews] -> setear value visible
    $('[reviews]').each(function (this: HTMLElement) {
      const v = $(this).attr('reviews');
      if (v != null) $(this).val(v);
    });
  }
};

/* =============================================
   Paginación con jQuery (clase .pagination)
   ============================================= */
export const Pagination = {
  fnc(): void {
    if ($('.pagination').length > 0) {
      $('.pagination a').on('click', function (this: HTMLElement,e: Event) {
        e.preventDefault();
        const page = $(this).attr('href');
        if (page) {
          // Navegar a la página
          window.location.href = page;
        }
      });
    }
  }
};

/* =============================================
   Configuración para Select2
   ============================================= */
export const Select2Cofig = {
  fnc(): void {
    if ($('.select2').length > 0) {
      $('.select2').each(function (this: HTMLElement) {
        const el = $(this);
        el.select2({
          placeholder: el.data('placeholder') || 'Select an option',
          allowClear: true,
          width: '100%'
        });
      });
    }
  }
};

/* =============================================
   CountDown: [data-countdown="2025-12-31T23:59:59Z"]
   Rellena el texto con: DDd HH:MM:SS y se detiene al llegar a 0.
   ============================================= */
export const CountDown = {
  fnc(): void {
    $('[data-countdown]').each(function (this: HTMLElement) {
      const el = $(this);
      const endStr = el.attr('data-countdown');
      if (!endStr) return;
      const end = new Date(endStr).getTime();
      if (isNaN(end)) return;

      const tick = () => {
        const now = Date.now();
        const dist = end - now;
        if (dist <= 0) {
          el.text('Expired');
          clearInterval(timer);
          return;
        }
        const days = Math.floor(dist / (1000 * 60 * 60 * 24));
        const hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((dist % (1000 * 60)) / 1000);
        el.text(
          `${days}d ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
      };

      tick();
      const timer = setInterval(tick, 1000);
    });
  }
};

/* =============================================
   ProgressBar: .progress-bar[data-value="70"]
   Setea el width y (opcional) el texto.
   ============================================= */
export const ProgressBar = {
  fnc(): void {
    $('.progress-bar').each(function (this: HTMLElement) {
      const el = $(this);
      const val = Number(el.data('value') ?? 0);
      const pct = Math.max(0, Math.min(100, val));
      el.css('width', `${pct}%`);
      const label = el.find('.progress-label');
      if (label.length) label.text(`${pct}%`);
    });
  }
};

/* =============================================
   SlickConfig: inicializa slick si está presente
   Requiere: slick-carousel (jQuery plugin)
   ============================================= */
export const SlickConfig = {
  fnc(): void {
    const hasSlick = ($ as any).fn && ($ as any).fn.slick;
    if (!hasSlick) {
      console.warn(
        '[SlickConfig] slick no encontrado. Instala "slick-carousel" o agrega el script.'
      );
      return;
    }
    $('.slick-slider').each(function (this: HTMLElement) {
      const el = $(this);
      // lee opciones por data-attrs si existen
      el.slick({
        slidesToShow: Number(el.data('slides')) || 4,
        slidesToScroll: Number(el.data('scroll')) || 1,
        autoplay: el.data('auto') ?? true,
        autoplaySpeed: Number(el.data('speed')) || 3000,
        arrows: el.data('arrows') ?? true,
        dots: el.data('dots') ?? false,
        infinite: el.data('loop') ?? true,
        responsive: [
          { breakpoint: 1200, settings: { slidesToShow: Number(el.data('xl')) || 4 } },
          { breakpoint: 992, settings: { slidesToShow: Number(el.data('lg')) || 3 } },
          { breakpoint: 768, settings: { slidesToShow: Number(el.data('md')) || 2 } },
          { breakpoint: 576, settings: { slidesToShow: Number(el.data('sm')) || 1 } }
        ]
      });
    });
  }
};

/* =============================================
   ProductLightbox: abre imágenes en lightbox si existe magnificPopup/lightGallery;
   si no, fallback a abrir en nueva pestaña.
   HTML esperado: <a class="product-lightbox" href="img.jpg"><img .../></a>
   ============================================= */
export const ProductLightbox = {
  fnc(): void {
    const hasMagnific = ($ as any).fn && ($ as any).fn.magnificPopup;
    const sel = '.product-lightbox';

    if (hasMagnific) {
      $(sel).magnificPopup({
        type: 'image',
        gallery: { enabled: true },
        delegate: 'a'
      });
      return;
    }

    // Fallback simple
    $(sel).on('click', function (this: HTMLElement,e: Event) {
      const href = ($(this).attr('href') || $(this).data('src')) as string;
      if (!href) return;
      e.preventDefault();
      window.open(href, '_blank');
    });
  }
};

/* =============================================
   Quantity: botones +/− que afectan input.qty-input
   Estructura: <div class="qty"><button class="qty-dec">-</button>
               <input class="qty-input" type="number" min="1" value="1">
               <button class="qty-inc">+</button></div>
   ============================================= */
export const Quantity = {
  fnc(): void {
    $(document).on('click', '.qty-inc, .qty-dec', function (this: HTMLElement,e: Event) {
      e.preventDefault();
      const isInc = $(this).hasClass('qty-inc');
      const container = $(this).closest('.qty');
      const input = container.find('.qty-input');
      const min = Number(input.attr('min') ?? 1);
      const max = Number(input.attr('max') ?? 9999999);
      let val = Number(input.val() ?? min);

      val = isNaN(val) ? min : val;
      val = isInc ? val + 1 : val - 1;
      if (val < min) val = min;
      if (val > max) val = max;

      input.val(val).trigger('change');
    });
  }
};

/* =============================================
   Tooltip: usa Bootstrap si está; fallback title nativo
   data-toggle="tooltip" title="Texto"
   ============================================= */
export const Tooltip = {
  fnc(): void {
    const hasBs = ($ as any).fn && ($ as any).fn.tooltip;
    if (hasBs) {
      $('[data-toggle="tooltip"]').tooltip();
    } else {
      // Fallback: nada que inicializar; el atributo title funciona nativo
      console.warn('[Tooltip] Bootstrap tooltip no encontrado; usando title nativo.');
    }
  }
};

/* =============================================
   Share: usa Web Share API si disponible; fallback a copiar URL.
   Elementos con [data-share] y opcional:
     data-title="..." data-text="..." data-url="..."
   ============================================= */
export const Share = {
  fnc(): void {
    $(document).on('click', '[data-share]', async function (this: HTMLElement,e: Event) {
      e.preventDefault();
      const el = $(this);
      const data = {
        title: el.data('title') || document.title,
        text: el.data('text') || '',
        url: el.data('url') || window.location.href
      };

      // Web Share API
      if ((navigator as any).share) {
        try {
          await (navigator as any).share(data);
          return;
        } catch (err) {
          // usuario canceló o no soportado; continuamos fallback
        }
      }

      // Fallback: copiar al portapapeles
      try {
        await navigator.clipboard.writeText(data.url);
        if (typeof (window as any).Swal !== 'undefined') {
          (window as any).Swal.fire({ icon: 'success', title: 'Link copied', text: data.url });
        } else {
          alert('Link copied: ' + data.url);
        }
      } catch {
        // Fallback final: abrir popup de redes si shapeShare estuviera disponible
        if (typeof (window as any).shapeShare !== 'undefined') {
          try {
            (window as any).shapeShare(data.url);
          } catch {}
        } else {
          window.open(data.url, '_blank');
        }
      }
    });
  }
};
