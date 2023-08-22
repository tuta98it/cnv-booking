import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHistoryHoldingTicketComponent } from './admin-history-holding-ticket.component';

describe('AdminHistoryHoldingTicketComponent', () => {
  let component: AdminHistoryHoldingTicketComponent;
  let fixture: ComponentFixture<AdminHistoryHoldingTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHistoryHoldingTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHistoryHoldingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
