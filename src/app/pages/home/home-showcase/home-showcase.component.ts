import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';

import { CategoriesService } from '../../../services/categories.service';
import { SubCategoriesService } from '../../../services/sub-categories.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-home-showcase',
  templateUrl: './home-showcase.component.html',
  styleUrls: ['./home-showcase.component.css'],
  standalone: false
})
export class HomeShowcaseComponent implements OnInit {
  path: string = Path.url;
  categories: any[] = [];
  categoryDetails: { [key: string]: { subcategories: any[], products: any[] } } = {};
  preload: boolean = false;
  render: boolean = true;
  verticalSliderConfig: any = {
    slidesPerView: 1,
    autoplay: { delay: 7000 },
    loop: true,
    navigation: true,
    pagination: { clickable: true }
  };

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly subCategoriesService: SubCategoriesService,
    private readonly productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.preload = true;

    let getCategories = [];

    this.categoriesService.getData().subscribe((resp: any) => {
      let i;

      for (i in resp) {
        getCategories.push(resp[i]);
      }

      getCategories.sort((a, b) => b.view - a.view);

      getCategories.forEach((category, index) => {
        if (index < 6) {
          this.categories[index] = getCategories[index];
          this.categoryDetails[getCategories[index].name] = {
            subcategories: [],
            products: []
          };
          this.preload = false;
        }
      });
    });
  }

  callback(indexes: any) {
    if (this.render) {
      this.render = false;

      this.categories.forEach((category) => {
        this.loadSubcategories(category);
        this.loadProducts(category);
      });
    }
  }

  private loadSubcategories(category: any) {
    this.subCategoriesService.getFilterData('category', category.name).subscribe((resp: any) => {
      for (const i in resp) {
        this.categoryDetails[category.name].subcategories.push({
          subcategory: resp[i].name,
          url: resp[i].url
        });
      }
    });
  }

  private loadProducts(category: any) {
    this.productsService.getFilterDataWithLimit('category', category.url, 6).subscribe((resp: any) => {
      for (const i in resp) {
        const product = resp[i];
        const rating = this.calculateRating(product.reviews);
        const priceInfo = this.calculatePrice(product.price, product.offer);

        this.categoryDetails[category.name].products.push({
          url: product.url,
          name: product.name,
          image: product.image,
          category: product.category,
          rating: rating,
          priceInfo: priceInfo,
          stock: product.stock,
          vertical_slider: product.vertical_slider
        });
      }
    });
  }

  private calculateRating(reviews: any): number {
    let totalReview = 0;
    const reviewsArray = JSON.parse(reviews);
    for (let f = 0; f < reviewsArray.length; f++) {
      totalReview += Number(reviewsArray[f]['review']);
    }
    return Math.round(totalReview / reviewsArray.length);
  }

  private calculatePrice(price: number, offer: string): any {
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
        let discount = '';

        if (type == 'Disccount') {
          offerPrice = (price - (price * value) / 100).toFixed(2);
          discount = `-${value}%`;
        } else if (type == 'Fixed') {
          offerPrice = value;
          const percentageDiscount = Math.round((offerPrice * 100) / price);
          discount = `-${percentageDiscount}%`;
        }

        return {
          originalPrice: price,
          offerPrice: offerPrice,
          discount: discount,
          isOnSale: true
        };
      }
    }

    return {
      originalPrice: price,
      offerPrice: null,
      discount: '',
      isOnSale: false
    };
  }
}
