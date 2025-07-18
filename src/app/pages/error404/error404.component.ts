import { Component, OnInit } from '@angular/core';

import { Path } from '../../config';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css'],
  standalone: false
})
export class Error404Component implements OnInit {
  path: string = Path.url;

  constructor() {}

  ngOnInit(): void {}
}
