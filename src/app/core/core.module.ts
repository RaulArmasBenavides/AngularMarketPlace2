import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../modules/header/header.component';
import { HeaderPromotionComponent } from '../modules/header-promotion/header-promotion.component';
import { HeaderMobileComponent } from '../modules/header-mobile/header-mobile.component';
import { NewletterComponent } from '../modules/newletter/newletter.component';
import { FooterComponent } from '../modules/footer/footer.component';

@NgModule({
  declarations: [
    HeaderComponent,
    HeaderPromotionComponent,
    HeaderMobileComponent,
    NewletterComponent,
    FooterComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    HeaderComponent,
    HeaderPromotionComponent,
    HeaderMobileComponent,
    NewletterComponent,
    FooterComponent
  ]
})
export class CoreModule {}
