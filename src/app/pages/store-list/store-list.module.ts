import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { StoreListComponent } from './store-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [StoreListComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    RouterModule.forChild([
      { path: '', component: StoreListComponent },
      { path: ':param', component: StoreListComponent }
    ])
  ]
})
export class StoreListModule {}
