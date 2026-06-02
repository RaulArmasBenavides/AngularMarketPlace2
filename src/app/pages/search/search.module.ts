import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SearchComponent } from './search.component';
import { SearchBreadcrumbComponent } from './search-breadcrumb/search-breadcrumb.component';
import { SearchShowcaseComponent } from './search-showcase/search-showcase.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SearchComponent, SearchBreadcrumbComponent, SearchShowcaseComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    RouterModule.forChild([{ path: '', component: SearchComponent }])
  ]
})
export class SearchModule {}
