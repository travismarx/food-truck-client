import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSendComponent } from './order-send.component';

describe('OrderSendComponent', () => {
  let component: OrderSendComponent;
  let fixture: ComponentFixture<OrderSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
