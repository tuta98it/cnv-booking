import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPartnerComponent } from './action-partner.component';

describe('CreateCompanyComponent', () => {
  let component: ActionPartnerComponent;
  let fixture: ComponentFixture<ActionPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPartnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
