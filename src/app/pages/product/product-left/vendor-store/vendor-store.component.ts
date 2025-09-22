import { Component, OnInit, Input } from '@angular/core';
import { Path } from '../../../../config';

import { StoresService } from '../../../../services/stores.service';

@Component({
  selector: 'app-vendor-store',
  templateUrl: './vendor-store.component.html',
  styleUrls: ['./vendor-store.component.css'],
  standalone: false
})
export class VendorStoreComponent implements OnInit {
  @Input() childItem: any;
  path: string = Path.url;
  store: any[] = [];

  constructor(private readonly storesService: StoresService) {}

  ngOnInit(): void {
    this.storesService.getFilterData('store', this.childItem).subscribe((resp:any) => {
      for (const i in resp) {
        this.store.push(resp[i]);
      }
    });
  }
}
