/* eslint-disable @typescript-eslint/no-explicit-any */

// Declaraciones globales necesarias para librerías no tipadas
declare var Swal: any;
declare var paypal: any;
declare var Chart: any;

// ELIMINADO: OwlCarouselConfig — reemplazado por Swiper.js en componentes

// REESCRITO: BackgroundImage (sin jQuery)
export const BackgroundImage = {
  fnc(): void {
    document.querySelectorAll<HTMLElement>('[data-background]').forEach((el) => {
      const imagePath = el.getAttribute('data-background');
      if (imagePath) {
        el.style.background = `url(${imagePath})`;
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

// ELIMINADO: Tabs — mover a componente con variable de estado (click handler)
// Ya no se usa en nuevos componentes; controlar con *ngIf en template

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

// ELIMINADO: Rating — reemplazado por ngx-star-rating en componentes
// Ya no se necesita jQuery para manejar barras de progreso ni selects

// ELIMINADO: Pagination — usar Router.navigate() con queryParams en componente

// ELIMINADO: Select2Cofig — reemplazado por ng-select en componentes

// REESCRITO: CountDown (sin jQuery)
export const CountDown = {
  fnc(): void {
    document.querySelectorAll<HTMLElement>('[data-countdown]').forEach((el) => {
      const endStr = el.getAttribute('data-countdown');
      if (!endStr) return;
      const end = new Date(endStr).getTime();
      if (isNaN(end)) return;

      const tick = () => {
        const now = Date.now();
        const dist = end - now;
        if (dist <= 0) {
          el.textContent = 'Expired';
          clearInterval(timer);
          return;
        }
        const days = Math.floor(dist / (1000 * 60 * 60 * 24));
        const hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((dist % (1000 * 60)) / 1000);
        el.textContent = `${days}d ${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      };

      tick();
      const timer = setInterval(tick, 1000);
    });
  }
};

// REESCRITO: ProgressBar (sin jQuery)
export const ProgressBar = {
  fnc(): void {
    document.querySelectorAll<HTMLElement>('.progress-bar').forEach((el) => {
      const val = Number(el.getAttribute('data-value') ?? 0);
      const pct = Math.max(0, Math.min(100, val));
      el.style.width = `${pct}%`;
      const label = el.querySelector('.progress-label');
      if (label) label.textContent = `${pct}%`;
    });
  }
};

// ELIMINADO: SlickConfig — reemplazado por Swiper.js en componentes

// ELIMINADO: ProductLightbox — simplificar con *ngIf + overlay o (click) handler en componente

// ELIMINADO: Quantity — usar (click)="increment()" y (click)="decrement()" en componente

// REESCRITO: Tooltip (Bootstrap 5 nativo)
export const Tooltip = {
  fnc(): void {
    if (typeof (window as any).bootstrap !== 'undefined') {
      document.querySelectorAll<HTMLElement>('[data-toggle="tooltip"]').forEach((el) => {
        new (window as any).bootstrap.Tooltip(el);
      });
    }
  }
};

// REESCRITO: Share (sin jQuery, Web Share API)
const copyToClipboard = (data: any): void => {
  navigator.clipboard.writeText(data.url).then(() => {
    if (typeof (window as any).Swal !== 'undefined') {
      (window as any).Swal.fire({ icon: 'success', title: 'Link copied', text: data.url });
    } else {
      alert('Link copied: ' + data.url);
    }
  }).catch(() => {
    window.open(data.url, '_blank');
  });
};

export const Share = {
  fnc(): void {
    document.querySelectorAll<HTMLElement>('[data-share]').forEach((el) => {
      el.addEventListener('click', (e: Event) => {
        e.preventDefault();
        const data = {
          title: el.getAttribute('data-title') || document.title,
          text: el.getAttribute('data-text') || '',
          url: el.getAttribute('data-url') || window.location.href
        };

        if ((navigator as any).share) {
          (navigator as any).share(data).catch(() => {
            copyToClipboard(data);
          });
        } else {
          copyToClipboard(data);
        }
      });
    });
  }
};

// ELIMINADO: Datepicker — usar <input type="date"> nativo en template HTML

/* =============================================
   ChartJs: thin wrapper sobre window.Chart
   Uso:
     ChartJs.render('#miCanvas', { type:'bar', data:{...}, options:{...} })
   o inicialización por data-attrs:
     <canvas data-chart='{"type":"bar","data":{...}}'></canvas>
   ============================================= */
export const ChartJs = {
  render(selectorOrCanvas: string | HTMLCanvasElement, config: any): any {
    if (typeof (window as any).Chart === 'undefined') {
      console.warn('[ChartJs] Chart.js no está cargado en window.Chart');
      return null;
    }
    const canvas =
      typeof selectorOrCanvas === 'string'
        ? (document.querySelector(selectorOrCanvas) as HTMLCanvasElement)
        : selectorOrCanvas;

    if (!canvas) {
      console.warn('[ChartJs] Canvas no encontrado para selector:', selectorOrCanvas);
      return null;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Guarda instancia para poder destruir luego
    const prev: any = (canvas as any).__chartInstance__;
    if (prev && typeof prev.destroy === 'function') prev.destroy();

    const chart = new (window as any).Chart(ctx, config);
    (canvas as any).__chartInstance__ = chart;
    return chart;
  },

  initFromDataAttrs(rootSelector = 'canvas[data-chart]'): void {
    if (typeof (window as any).Chart === 'undefined') {
      console.warn('[ChartJs] Chart.js no está cargado en window.Chart');
      return;
    }
    const nodes = document.querySelectorAll<HTMLCanvasElement>(rootSelector);
    nodes.forEach((node) => {
      try {
        const cfgStr = node.getAttribute('data-chart');
        if (!cfgStr) return;
        const cfg = JSON.parse(cfgStr);
        this.render(node, cfg);
      } catch (e) {
        console.error('[ChartJs] Config inválida en data-chart:', e);
      }
    });
  },

  destroy(selectorOrCanvas: string | HTMLCanvasElement): void {
    const canvas =
      typeof selectorOrCanvas === 'string'
        ? (document.querySelector(selectorOrCanvas) as HTMLCanvasElement)
        : selectorOrCanvas;

    const inst: any = (canvas as any)?.__chartInstance__;
    if (inst && typeof inst.destroy === 'function') inst.destroy();
    if (canvas) (canvas as any).__chartInstance__ = null;
  }
};
