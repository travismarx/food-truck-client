import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-receive',
  templateUrl: './order-receive.component.html',
  styleUrls: ['./order-receive.component.scss'],
})
export class OrderReceiveComponent implements OnInit {
  @Input() orders: any;

  constructor() {}

  ngOnInit(): void {}
}
