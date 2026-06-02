import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { TagInputModule } from 'ngx-chips';
import { AccountComponent } from './account.component';
import { AccountBreadcrumbComponent } from './account-breadcrumb/account-breadcrumb.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { AccountWishlistComponent } from './account-profile/account-wishlist/account-wishlist.component';
import { AccountMyShoppingComponent } from './account-profile/account-my-shopping/account-my-shopping.component';
import { AccountNewStoreComponent } from './account-profile/account-new-store/account-new-store.component';
import { AccountMyStoreComponent } from './account-profile/account-my-store/account-my-store.component';
import { AccountMySalesComponent } from './account-profile/account-my-sales/account-my-sales.component';
import { AccountOrdersComponent } from './account-profile/account-orders/account-orders.component';
import { AccountDisputesComponent } from './account-profile/account-disputes/account-disputes.component';
import { AccountMessagesComponent } from './account-profile/account-messages/account-messages.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    AccountComponent,
    AccountBreadcrumbComponent,
    AccountProfileComponent,
    AccountWishlistComponent,
    AccountMyShoppingComponent,
    AccountNewStoreComponent,
    AccountMyStoreComponent,
    AccountMySalesComponent,
    AccountOrdersComponent,
    AccountDisputesComponent,
    AccountMessagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxDropzoneModule,
    TagInputModule,
    ConfirmationPopoverModule,
    RouterModule.forChild([
      { path: '', component: AccountComponent },
      { path: ':param', component: AccountComponent }
    ])
  ]
})
export class AccountModule {}
