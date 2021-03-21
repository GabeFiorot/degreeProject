import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleBuilderComponent } from './schedule-builder.component';

describe('ScheduleBuilderComponent', () => {
  let component: ScheduleBuilderComponent;
  let fixture: ComponentFixture<ScheduleBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
