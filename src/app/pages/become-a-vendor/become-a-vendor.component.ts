import { Component, OnInit } from '@angular/core';
import { Path } from '../../config.js';

@Component({
  selector: 'app-become-a-vendor',
  templateUrl: './become-a-vendor.component.html',
  styleUrls: ['./become-a-vendor.component.css'],
  standalone: false
})
export class BecomeAVendorComponent implements OnInit {
  path: string = Path.url;

  constructor() {}

  ngOnInit(): void {}
}
