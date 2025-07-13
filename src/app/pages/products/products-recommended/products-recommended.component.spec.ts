import { waitForAsync , ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsRecommendedComponent } from './products-recommended.component';

describe('ProducstRecommendedComponent', () => {
  let component: ProductsRecommendedComponent;
  let fixture: ComponentFixture<ProductsRecommendedComponent>;

  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsRecommendedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsRecommendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
