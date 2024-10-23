import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNotificationComponent } from './top-notification.component';

describe('TopNotificationComponent', () => {
  let component: TopNotificationComponent;
  let fixture: ComponentFixture<TopNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
