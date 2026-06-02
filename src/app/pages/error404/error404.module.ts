import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Error404Component } from './error404.component';

@NgModule({
  declarations: [Error404Component],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: Error404Component }])]
})
export class Error404Module {}
