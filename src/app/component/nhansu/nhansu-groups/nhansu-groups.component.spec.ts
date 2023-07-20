import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NhansuGroupsComponent } from './nhansu-groups.component';

describe('NhansuGroupsComponent', () => {
  let component: NhansuGroupsComponent;
  let fixture: ComponentFixture<NhansuGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NhansuGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NhansuGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
