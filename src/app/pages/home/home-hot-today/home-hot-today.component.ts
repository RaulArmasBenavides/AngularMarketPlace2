import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { CountDown, ProgressBar, DinamicReviews } from '../../../functions';
import { ProductsService } from '../../../services/products.service';
import { SalesService } from '../../../services/sales.service';

@Component({
  selector: 'app-home-hot-today',
  templateUrl: './home-hot-today.component.html',
  styleUrls: ['./home-hot-today.component.css'],
  standalone: false
})
export class HomeHotTodayComponent implements OnInit {
  path: string = Path.url;
  indexes: any[] = [];
  products: any[] = [];
  render: boolean = true;
  preload: boolean = false;
  topSales: any[] = [];
  topSalesBlock: any[] = [];
  renderBestSeller: boolean = true;

  dealProducts: any[] = [];
  topSalesProducts: any[] = [];
  carouselVisible: boolean = false;

  constructor(
    private readonly productsService: ProductsService,
    private readonly salesService: SalesService
  ) {}

  ngOnInit(): void {
    this.preload = true;

    let getProducts = [];
    let hoy = new Date();
    let fechaOferta = null;

    this.productsService.getData().subscribe((resp: any) => {
      let i;

      for (i in resp) {
        getProducts.push({
          offer: resp[i].offer,
          stock: resp[i].stock
        });

        this.products.push(resp[i]);
      }

      let count = 0;

      for (i in getProducts) {
        count++;

        if (getProducts[i]['offer'] != '') {
          fechaOferta = new Date(
            parseInt(JSON.parse(getProducts[i]['offer'])[2].split('-')[0]),
            parseInt(JSON.parse(getProducts[i]['offer'])[2].split('-')[1]) - 1,
            parseInt(JSON.parse(getProducts[i]['offer'])[2].split('-')[2])
          );

          if (hoy < fechaOferta && getProducts[i]['stock'] > 0) {
            this.indexes.push(i);
          }
        }
      }

      if (count == getProducts.length) {
        this.preload = false;
      }
    });

    let getSales = [];

    this.salesService.getData().subscribe((resp: any) => {
      let i;

      for (i in resp) {
        getSales.push({
          product: resp[i].product,
          quantity: resp[i].quantity
        });
      }

      getSales.sort((a, b) => b.quantity - a.quantity);

      let filterSales: any = [];

      getSales.forEach((sale: any) => {
        if (!filterSales.find((resp: any) => resp.product == sale.product)) {
          const { product, quantity } = sale;
          filterSales.push({ product, quantity });
        }
      });

      let block = 0;

      filterSales.forEach((sale: any, index: any) => {
        if (index < 20) {
          block++;

          this.productsService.getFilterData('name', sale.product).subscribe((resp: any) => {
            let i;

            for (i in resp) {
              this.topSales.push(resp[i]);
            }
          });
        }
      });

      let count = 0;

      for (let i = 0; i < Math.ceil(block / 4); i++) {
        count++;
        this.topSalesBlock.push(i);
      }

      if (count == this.topSalesBlock.length) {
        this.topSalesBlock.pop();
      }
    });
  }

  callback() {
    if (this.render) {
      this.render = false;
      this.processDealProducts();
    }
  }

  private processDealProducts() {
    this.indexes.forEach((idx) => {
      const product = this.products[idx];

      if (product && product.offer) {
        const gallery = JSON.parse(product.gallery || '[]');
        const offer = JSON.parse(product.offer);

        const productData = {
          url: product.url,
          name: product.name,
          category: product.category,
          image: product.image,
          price: product.price,
          reviews: product.reviews,
          offer: offer,
          gallery: gallery,
          offerPrice: this.calculateOfferPrice(product.price, offer),
          offerDisplay: this.getOfferDisplay(product.price, offer),
          rating: this.calculateRating(product.reviews),
          offerDate: new Date(
            parseInt(offer[2].split('-')[0]),
            parseInt(offer[2].split('-')[1]) - 1,
            parseInt(offer[2].split('-')[2])
          ),
          galleryItems: gallery.map((img: any) => ({
            large: `assets/img/products/${product.category}/gallery/${img}`,
            thumb: `assets/img/products/${product.category}/gallery/${img}`
          }))
        };

        this.dealProducts.push(productData);
      }
    });

    this.carouselVisible = true;

    setTimeout(() => {
      CountDown.fnc();
      ProgressBar.fnc();
    }, 100);
  }

  callbackBestSeller(topSales: any) {
    if (this.renderBestSeller) {
      this.renderBestSeller = false;

      setTimeout(() => {
        this.processBestSellers(topSales);
      }, this.topSalesBlock.length * 50);
    }
  }

  private processBestSellers(topSales: any) {
    const itemsPerBlock = Math.ceil(topSales.length / this.topSalesBlock.length);

    this.topSalesBlock.forEach((_, blockIdx) => {
      const startIdx = blockIdx * itemsPerBlock;
      const endIdx = Math.min(startIdx + itemsPerBlock, topSales.length);

      for (let i = startIdx; i < endIdx; i++) {
        if (topSales[i]) {
          const product = topSales[i];
          const priceInfo = this.getPriceInfo(product.price, product.offer);

          this.topSalesProducts.push({
            url: product.url,
            name: product.name,
            category: product.category,
            image: product.image,
            priceInfo: priceInfo,
            blockIndex: blockIdx
          });
        }
      }
    });
  }

  private calculateOfferPrice(price: number, offer: any): number {
    if (offer[0] == 'Disccount') {
      return parseFloat((price - (price * offer[1]) / 100).toFixed(2));
    } else if (offer[0] == 'Fixed') {
      return parseFloat(offer[1]);
    }
    return price;
  }

  private getOfferDisplay(price: number, offer: any): string {
    if (offer[0] == 'Disccount') {
      const savings = ((price * offer[1]) / 100).toFixed(2);
      return `Save\n$${savings}`;
    } else if (offer[0] == 'Fixed') {
      const savings = (price - offer[1]).toFixed(2);
      return `Save\n$${savings}`;
    }
    return '';
  }

  private getPriceInfo(price: number, offer: string) {
    if (offer != '') {
      const offerData = JSON.parse(offer);
      const offerDate = new Date(
        parseInt(offerData[2].split('-')[0]),
        parseInt(offerData[2].split('-')[1]) - 1,
        parseInt(offerData[2].split('-')[2])
      );

      const today = new Date();

      if (today < offerDate) {
        const type = offerData[0];
        const value = offerData[1];
        let offerPrice;

        if (type == 'Disccount') {
          offerPrice = (price - (price * value) / 100).toFixed(2);
        } else {
          offerPrice = value;
        }

        return {
          originalPrice: price,
          offerPrice: offerPrice,
          isOnSale: true
        };
      }
    }

    return {
      originalPrice: price,
      offerPrice: null,
      isOnSale: false
    };
  }

  private calculateRating(reviews: any): number {
    let totalReview = 0;
    const reviewsArray = JSON.parse(reviews || '[]');
    for (let f = 0; f < reviewsArray.length; f++) {
      totalReview += Number(reviewsArray[f]['review']);
    }
    return reviewsArray.length > 0 ? Math.round(totalReview / reviewsArray.length) : 0;
  }
}
