import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReserveSeatHotelComponent } from './confirm-reserve-seat-hotel.component';

describe('ConfirmReserveSeatComponent', () => {
  let component: ConfirmReserveSeatHotelComponent;
  let fixture: ComponentFixture<ConfirmReserveSeatHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmReserveSeatHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmReserveSeatHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
