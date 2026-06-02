import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BecomeAVendorComponent } from './become-a-vendor.component';

@NgModule({
  declarations: [BecomeAVendorComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: BecomeAVendorComponent }])]
})
export class BecomeAVendorModule {}
