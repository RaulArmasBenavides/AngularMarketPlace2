import { waitForAsync , ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMyStoreComponent } from './account-my-store.component';

describe('AccountMyStoreComponent', () => {
  let component: AccountMyStoreComponent;
  let fixture: ComponentFixture<AccountMyStoreComponent>;

  beforeEach(waitForAsync (() => {
    TestBed.configureTestingModule({
      declarations: [ AccountMyStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountMyStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
