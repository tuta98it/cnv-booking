import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReserveSeatComponent } from './confirm-reserve-seat.component';

describe('ConfirmReserveSeatComponent', () => {
  let component: ConfirmReserveSeatComponent;
  let fixture: ComponentFixture<ConfirmReserveSeatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmReserveSeatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmReserveSeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
