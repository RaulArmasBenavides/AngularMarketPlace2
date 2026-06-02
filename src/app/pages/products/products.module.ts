import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductsBreadcrumbComponent } from './products-breadcrumb/products-breadcrumb.component';
import { BestSalesItemComponent } from './best-sales-item/best-sales-item.component';
import { ProductsRecommendedComponent } from './products-recommended/products-recommended.component';
import { ProductsShowcaseComponent } from './products-showcase/products-showcase.component';
import { SharedModule } from '../../shared/shared.module';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsBreadcrumbComponent,
    BestSalesItemComponent,
    ProductsRecommendedComponent,
    ProductsShowcaseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: ProductsComponent }])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsModule {}
