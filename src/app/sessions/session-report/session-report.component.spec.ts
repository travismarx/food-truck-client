import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionReportComponent } from './session-report.component';

describe('SessionReportComponent', () => {
  let component: SessionReportComponent;
  let fixture: ComponentFixture<SessionReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
