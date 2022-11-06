import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionLookupComponent } from './session-lookup.component';

describe('SessionLookupComponent', () => {
  let component: SessionLookupComponent;
  let fixture: ComponentFixture<SessionLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
