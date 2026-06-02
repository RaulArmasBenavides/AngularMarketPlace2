import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlsecurePipe } from '../pipes/urlsecure.pipe';
import { KeysPipe } from '../pipes/keys.pipe';
import { StarRatingComponent } from './star-rating/star-rating.component';

@NgModule({
  declarations: [UrlsecurePipe, KeysPipe, StarRatingComponent],
  exports: [CommonModule, UrlsecurePipe, KeysPipe, StarRatingComponent]
})
export class SharedModule {}
