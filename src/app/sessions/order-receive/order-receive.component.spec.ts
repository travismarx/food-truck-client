import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReceiveComponent } from './order-receive.component';

describe('OrderReceiveComponent', () => {
  let component: OrderReceiveComponent;
  let fixture: ComponentFixture<OrderReceiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderReceiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
