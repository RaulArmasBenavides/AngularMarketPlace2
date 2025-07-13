import { waitForAsync , ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBreadcrumbComponent } from './search-breadcrumb.component';

describe('SearchBreadcrumbComponent', () => {
  let component: SearchBreadcrumbComponent;
  let fixture: ComponentFixture<SearchBreadcrumbComponent>;

  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
