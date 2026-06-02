import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: false,
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.css'
})
export class StarRatingComponent {
  @Input() value: number = 0;
  @Input() totalStars: number = 5;
  @Input() readOnly: boolean = false;
  @Input() color: string = '#FFB400';
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [];

  ngOnInit() {
    this.stars = Array(this.totalStars).fill(0).map((_, i) => i + 1);
  }

  getStarColor(index: number): string {
    return index <= this.value ? this.color : '#ccc';
  }

  setRating(rating: number) {
    if (!this.readOnly) {
      this.value = rating;
      this.ratingChange.emit(rating);
    }
  }
}
