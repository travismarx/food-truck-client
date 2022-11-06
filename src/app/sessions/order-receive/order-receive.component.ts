import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-order-receive',
  templateUrl: './order-receive.component.html',
  styleUrls: ['./order-receive.component.scss'],
})
export class OrderReceiveComponent implements OnInit, OnChanges {
  @Input() orders: any;
  @Input() readyOrders: any;
  @Input() menuLabels: any;
  @Input() loadingOrders: boolean;
  @Input() loadingReadyOrders: boolean;
  @Input() ordersCount: number;
  @Input() readyOrdersCount: number;
  @Input() avgOrderTime: number;

  @Output() onOrderReady = new EventEmitter<number>();
  @Output() refreshOrders = new EventEmitter<void>();
  @Output() onReadyOrdersPaginate = new EventEmitter();

  labelWidth: string;

  quantityPerItem = [];
  formattedOrders = [];

  now = new Date();
  nowTimestamp = this.getCurrentTimestampInSeconds();
  playOrderSound = true;

  constructor() {}

  ngOnInit(): void {
    setInterval(() => {
      this.now = new Date();
      this.nowTimestamp = this.getCurrentTimestampInSeconds();
    }, 1);
    // this.menuLabels = this.menu.filter((item) => !item.ignore);
  }

  ngOnChanges(changes) {
    if (
      changes.menuLabels?.currentValue &&
      changes.menuLabels?.currentValue.length
    ) {
      this.labelWidth = `${80 / changes.menuLabels.currentValue.length}%`;
      if (this.orders && this.orders.length) {
        this.calculateQuantityPerItem(this.orders);
      }
    }

    if (changes.orders && changes.orders.currentValue) {
      if (
        changes.orders.currentValue.length &&
        this.menuLabels &&
        this.menuLabels.length
      ) {
        this.calculateQuantityPerItem(changes.orders.currentValue);
        if (this.playOrderSound) {
          this.determineToPlayDing(changes.orders);
        }
      }

      if (!changes.orders.currentValue.length) {
        this.quantityPerItem = [];
        this.formattedOrders = [];
        if (this.menuLabels && this.menuLabels.length) {
          this.quantityPerItem = Array(this.menuLabels.length);
        }
      }
      // this.formatOrders(changes.orders.currentValue);
    }
  }

  determineToPlayDing(orders) {
    if (orders.previousValue && orders.currentValue) {
      if (orders.currentValue.length > orders.previousValue.length) {
        this.playAudio();
      }
    }
  }

  playAudio() {
    const audio = document.getElementById('audioplayer') as HTMLAudioElement;
    audio.play();
    // let audio = new Audio();
    // audio.src = '../../../assets/aooga.mp3';
    // audio.load();
    // audio.play();
  }

  getCurrentTimestampInSeconds() {
    return Math.round(Date.now() / 1000);
  }

  paginate(event) {
    this.onReadyOrdersPaginate.emit(event);
  }

  // formatOrders(orders) {}

  // This is BAD but whatever
  calculateQuantityPerItem(orders, localArrayName?) {
    const tempQuantityObject = {};
    for (let label of this.menuLabels) {
      tempQuantityObject[label.stub] = {
        quantity: 0,
        colorCode: label.colorCode,
      };
    }
    for (let order of orders) {
      for (let item of order.items.filter((item) => !item.ignore)) {
        tempQuantityObject[item.stub].quantity += item.quantity;
      }
      order.quantityObject = {};
      for (let label of this.menuLabels) {
        order.quantityObject[label.stub] = {
          quantity:
            order.items.filter((item) => item.stub === label.stub)[0]
              ?.quantity || 0,
          colorCode: label.colorCode,
        };
      }
      order.quantityObject = Object.values(order.quantityObject);
    }
    this.formattedOrders = orders.filter((order) => {
      return (
        order.quantityObject.reduce((acc, currentItem) => {
          return acc + currentItem.quantity;
        }, 0) > 0
      );
    });
    this.quantityPerItem = Object.values(tempQuantityObject);
  }

  // EXTRA BAD because this does the same as the method above for a different array
  // calculateQuantityPerItem(orders, localArrayName) {
  //   console.log('ORDERS TO ITERATE: ', orders);
  //   const tempQuantityObject = {};
  //   for (let label of this.menuLabels) {
  //     tempQuantityObject[label.stub] = {
  //       quantity: 0,
  //       colorCode: label.colorCode,
  //     };
  //   }
  //   console.log('tempQuantityObject: ', tempQuantityObject);
  //   for (let order of orders) {
  //     console.log('order: ', order);
  //     for (let item of order.items.filter((item) => !item.ignore)) {
  //       console.log('TEMP QUANTITY OBJECT: ', tempQuantityObject);
  //       tempQuantityObject[item.stub].quantity += item.quantity;
  //     }
  //     order.quantityObject = {};
  //     for (let label of this.menuLabels) {
  //       order.quantityObject[label.stub] = {
  //         quantity:
  //           order.items.filter((item) => item.stub === label.stub)[0]
  //             ?.quantity || 0,
  //         colorCode: label.colorCode,
  //       };
  //     }
  //     console.log('formatted order: ', order);
  //     order.quantityObject = Object.values(order.quantityObject);
  //   }

  //   this.formattedOrders = orders;
  //   console.log('formatted orders: ', this.formattedOrders);
  //   this.quantityPerItem = Object.values(tempQuantityObject);
  // }
}
