import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UrlsecurePipe } from '../pipes/urlsecure.pipe';
import { KeysPipe } from '../pipes/keys.pipe';

@NgModule({
  declarations: [UrlsecurePipe, KeysPipe],
  exports: [CommonModule, UrlsecurePipe, KeysPipe]
})
export class SharedModule {}
