import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StarRatingModule } from 'ng-starrating';
import { ProductComponent } from './product.component';
import { CallToActionComponent } from './call-to-action/call-to-action.component';
import { ProductBreadcrumbComponent } from './product-breadcrumb/product-breadcrumb.component';
import { ProductLeftComponent } from './product-left/product-left.component';
import { BoughtTogetherComponent } from './product-left/bought-together/bought-together.component';
import { VendorStoreComponent } from './product-left/vendor-store/vendor-store.component';
import { ReviewsComponent } from './product-left/reviews/reviews.component';
import { ProductRightComponent } from './product-right/product-right.component';
import { SimilarBoughtComponent } from './similar-bought/similar-bought.component';
import { RelatedProductComponent } from './related-product/related-product.component';
import { SharedModule } from '../../shared/shared.module';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@NgModule({
  declarations: [
    ProductComponent,
    CallToActionComponent,
    ProductBreadcrumbComponent,
    ProductLeftComponent,
    BoughtTogetherComponent,
    VendorStoreComponent,
    ReviewsComponent,
    ProductRightComponent,
    SimilarBoughtComponent,
    RelatedProductComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StarRatingModule,
    RouterModule.forChild([{ path: '', component: ProductComponent }])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductModule {}
