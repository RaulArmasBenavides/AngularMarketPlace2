import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchComponent } from './search.component';
import { SearchBreadcrumbComponent } from './search-breadcrumb/search-breadcrumb.component';
import { SearchShowcaseComponent } from './search-showcase/search-showcase.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SearchComponent, SearchBreadcrumbComponent, SearchShowcaseComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: SearchComponent }])
  ]
})
export class SearchModule {}
