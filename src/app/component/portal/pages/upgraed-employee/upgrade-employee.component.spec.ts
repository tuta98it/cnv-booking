import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeEmployeeComponent } from './upgrade-employee.component';

describe('CreateCompanyComponent', () => {
  let component: UpgradeEmployeeComponent;
  let fixture: ComponentFixture<UpgradeEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpgradeEmployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
