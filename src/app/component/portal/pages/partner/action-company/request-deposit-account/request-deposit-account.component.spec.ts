import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDepositAccountComponent } from './request-deposit-account.component';

describe('DepositAccountComponent', () => {
  let component: RequestDepositAccountComponent;
  let fixture: ComponentFixture<RequestDepositAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestDepositAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestDepositAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
