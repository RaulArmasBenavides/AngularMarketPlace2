import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ShoppingCartComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: ShoppingCartComponent }])
  ]
})
export class ShoppingCartModule {}
