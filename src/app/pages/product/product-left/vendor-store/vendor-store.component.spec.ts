import { waitForAsync , ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorStoreComponent } from './vendor-store.component';

describe('VendorStoreComponent', () => {
  let component: VendorStoreComponent;
  let fixture: ComponentFixture<VendorStoreComponent>;

  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      declarations: [ VendorStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
