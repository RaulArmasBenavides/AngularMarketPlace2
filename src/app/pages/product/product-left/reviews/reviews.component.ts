import { Component, OnInit, Input } from '@angular/core';
import { Path } from '../../../../config';
// DISABLED: import { Dinamic DinamicReviews } from '../../../../functions';


@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  standalone: false
})
export class ReviewsComponent implements OnInit {
  @Input() childItem: any;
  path: string = Path.url;
  rating: any[] = [];
  totalReviews: string;
  itemReviews: any[] = [];
  reviewOptions: number[] = [];
  starRatings: any[] = [];
  render: boolean = true;

  constructor() {}

  ngOnInit(): void {
    /*=============================================
        Rating
        =============================================*/

    this.rating.push(DinamicRating.fnc(this.childItem));

    /*=============================================
        Reviews
        =============================================*/

    let reviews = [];
    reviews.push(DinamicReviews.fnc(this.rating[0]));

    for (let i = 0; i < reviews[0].length; i++) {
      this.reviewOptions.push(i + 1);
    }

    this.totalReviews = JSON.parse(this.childItem['reviews']).length;

    for (let i = 5; i > 0; i--) {
      let starPercentage = 60;

      if (isNaN(starPercentage)) {
        starPercentage = 0;
      }

      this.starRatings.push({
        star: i,
        percentage: starPercentage
      });
    }

    /*=============================================
        Enviamos a la vista las reseñas del producto
        =============================================*/

    this.itemReviews.push(JSON.parse(this.childItem['reviews']));
  }

  callback() {
    if (this.render) {
      this.render = false;
    }
  }
}
