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
      target.each(function () {
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
    $('[data-background]').each(function () {
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
    $('.ps-tab-list  li > a ').on('click', function (e: Event) {
      e.preventDefault();
      const target = $(this).attr('href');
      $(this).closest('li').siblings('li').removeClass('active');
      $(this).closest('li').addClass('active');
      $(target).addClass('active').siblings('.ps-tab').removeClass('active');
    });

    $('.ps-tab-list.owl-slider .owl-item a').on('click', function (e: Event) {
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
