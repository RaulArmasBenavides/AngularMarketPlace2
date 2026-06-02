import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreListComponent } from './store-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [StoreListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: StoreListComponent },
      { path: ':param', component: StoreListComponent }
    ])
  ]
})
export class StoreListModule {}
