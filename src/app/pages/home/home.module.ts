import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StarRatingModule } from 'ng-starrating';
import { HomeComponent } from './home.component';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';
import { HomePromotionsComponent } from './home-promotions/home-promotions.component';
import { HomeHotTodayComponent } from './home-hot-today/home-hot-today.component';
import { HomeTopCategoriesComponent } from './home-top-categories/home-top-categories.component';
import { HomeShowcaseComponent } from './home-showcase/home-showcase.component';
import { SharedModule } from '../../shared/shared.module';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@NgModule({
  declarations: [
    HomeComponent,
    HomeBannerComponent,
    HomeFeaturesComponent,
    HomePromotionsComponent,
    HomeHotTodayComponent,
    HomeTopCategoriesComponent,
    HomeShowcaseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StarRatingModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {}
