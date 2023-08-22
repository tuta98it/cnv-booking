import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVoidTicketComponent } from './admin-void-ticket.component';

describe('AdminVoidTicketComponent', () => {
  let component: AdminVoidTicketComponent;
  let fixture: ComponentFixture<AdminVoidTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminVoidTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVoidTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
