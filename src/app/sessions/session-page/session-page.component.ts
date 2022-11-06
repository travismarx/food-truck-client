import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { SessionsService } from '../sessions.service';
import { MessageService } from 'primeng/api';
import { SocketioService } from 'src/app/services/socketio.service';
import { map, take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.scss'],
  animations: [
    trigger('inOutAnimate', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class SessionPageComponent implements OnInit {
  sessionId!: number;
  loadingSession = false;
  sessionInfo!: any;
  sessionMenu!: any;
  currentOrder!: any;
  defaultOrder!: any;
  openOrders = [];
  readyOrders = [];
  menuLabels = [];
  quickNotes = [];
  loadingOrders = false;
  loadingReadyOrders = false;
  sendingOrder = false;
  selectedDiscount: any;
  openOrdersCount: number;
  readyOrdersCount: number;
  socketConnected = false;
  avgOrderTime = null;

  activeTabIdx = 0;
  activeTab!: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionsService,
    private messageService: MessageService,
    private socketioService: SocketioService
  ) {}

  // changeTab(event: any) {
  //   console.log('change tab to: ', event);
  //   this.activeTabLabel = event.item.label;
  //   this.chgRef.detectChanges();
  // }

  ngOnInit(): void {
    // this.activeTabLabel = this.menuItems[0].label;
    this.loadingSession = true;
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.sessionId = +params.get('id')!;
      this.subscribeToSocketStatus();
      this.getSessionOrdersOnInit();
      this.sessionService.getSessionData(this.sessionId).subscribe(
        (res: any) => {
          this.loadingSession = false;
          this.sessionInfo = res.sessionInfo;
          this.sessionMenu = res.sessionMenu;
          if (this.sessionInfo.status === 'complete') {
            this.activeTabIdx = 2;
          }
          this.getMenuLabels();
          this.setQuickNotes();
          this.currentOrder = {
            customerName: '',
            paid: null,
            change: 0,
            totalCost: 0,
            buzzerNumber: null,
            notes: null,
            sessionId: this.sessionId,
            discountId: null,
            items: res.sessionMenu.map((item: any) => {
              return {
                ...item,
                quantity: 0,
                totalCost: 0,
              };
            }),
          };
          this.defaultOrder = JSON.parse(JSON.stringify(this.currentOrder));
        },
        (err) => {
          this.showToast(
            'error',
            'Error',
            'An error occurred while retrieving orders.',
            5000
          );
        }
      );
    });

    // setTimeout(() => {
    //   this.listenForOrders();
    // }, 1000);
  }

  disableSendButton() {
    const total = this.currentOrder.items.reduce((acc, current) => {
      return acc + current.quantity;
    }, 0);
    return total < 1;
  }

  subscribeToSocketStatus() {
    this.socketioService.connected$.subscribe((val) => {
      this.socketConnected = val;
      if (val) {
        this.socketioService.joinSessionRoom(this.sessionId);
        this.listenForOrders();
      }
    });
  }

  setQuickNotes() {
    for (let note of this.sessionInfo.notesOptions) {
      note.command = ($event) => this.enterQuickNote($event);
    }
    // this.quickNotes = this.sessionInfo.quickNotes.map((note) => {
    // });
  }

  applyDiscount(event) {
    this.currentOrder.discountId = event.value?.discountId;
    this.calculateTotalOrderCost();
    // this.currentOrder.totalCost =
    //   this.currentOrder.totalCost * (event.value.percentOff / 100);
  }

  enterQuickNote(event) {
    // const currentNote =
    //   typeof this.currentOrder.notes === 'string'
    //     ? this.currentOrder.notes
    //     : this.currentOrder.notes?.label;
    const newNote =
      typeof event.value === 'string' ? event.value : event.value?.label;

    this.currentOrder.notes = newNote;
  }

  getMenuLabels() {
    this.menuLabels = this.sessionMenu.filter((menuItem) => !menuItem.ignore);
  }

  listenForOrders() {
    setTimeout(() => {
      this.socketioService.socket.on('new-order', (data) => {
        this.getSessionOrdersOnInit();
      });

      this.socketioService.socket.on('order-ready', () => {
        this.getSessionOrdersOnInit();
      });
    }, 100);
  }

  getSessionOrdersOnInit() {
    const openOrderParms = {
      status: 'open',
      offset: 0,
      limit: null,
      orderBy: 'created_timestamp',
      sortDir: 'asc',
    };
    const readyOrderParms = {
      status: 'ready',
      offset: 0,
      limit: 10,
      orderBy: 'updated_timestamp',
      sortDir: 'desc',
    };
    this.updateOrderLists(openOrderParms, readyOrderParms);
  }

  handleReadyOrdersPage(event) {
    this.loadingReadyOrders = true;
    const readyOrderParms = {
      status: 'ready',
      offset: event.first,
      limit: 10,
      orderBy: 'updated_timestamp',
      sortDir: 'desc',
    };
    this.sessionService
      .getSessionOrdersByStatus(this.sessionId, readyOrderParms)
      .subscribe((res: any) => {
        this.loadingReadyOrders = false;
        this.readyOrders = res.orders;
        this.readyOrdersCount = res.count;
      });
  }

  increaseQuantity(idx: number) {
    const item = this.currentOrder.items[idx];
    item.quantity++;
    item.totalCost = item.quantity * item.price;
    this.calculateTotalOrderCost();
  }

  decreaseQuantity(idx: number) {
    const item = this.currentOrder.items[idx];
    item.quantity--;
    if (item.quantity < 0) item.quantity = 0;
    item.totalCost = item.quantity * item.price;
    this.calculateTotalOrderCost();
  }

  onQuantityUpdate(event, idx) {
    const item = this.currentOrder.items[idx];
    item.quantity = +event.target.value;
    item.totalCost = item.quantity * item.price;
    this.calculateTotalOrderCost();
  }

  calculateTotalOrderCost() {
    const totalCost = this.currentOrder.items.reduce((a: any, b: any) => {
      return a + b.totalCost;
    }, 0);

    this.currentOrder.totalCost = this.selectedDiscount?.percentOff
      ? +(totalCost * ((100 - this.selectedDiscount.percentOff) / 100)).toFixed(
          2
        )
      : totalCost;
    if (this.selectedDiscount) {
    }
    this.calculateChange();
  }

  onPaidInput(e: any) {
    this.currentOrder.paid = e.value;
    this.calculateChange();
  }

  onBuzzerInput(e: any) {
    this.currentOrder.buzzerNumber = e.value;
    // this.calculateChange();
  }

  increaseAmountPaid(amount: number) {
    this.currentOrder.paid += amount;
    this.calculateChange();
  }

  calculateChange() {
    this.currentOrder.change = +Math.max(
      0,
      this.currentOrder.paid - this.currentOrder.totalCost
    ).toFixed(2);
  }

  clearPaidInput() {
    this.currentOrder.paid = null;
    this.calculateChange();
  }

  clearBuzzerInput() {
    this.currentOrder.buzzerNumber = null;
  }

  sendOrder() {
    this.sendingOrder = true;
    try {
      this.sessionService.sendOrder(this.currentOrder).subscribe(
        (res) => {
          this.sendingOrder = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order successfully submitted',
          });
          this.resetDefaultAndCurrentOrders();
          setTimeout(() => {
            this.messageService.clear();
          }, 2000);
        },
        (error) => {
          this.sendingOrder = false;
          this.showToast(
            'error',
            'Error',
            'An error occurred while submitting order. Please try again',
            3000
          );
        }
      );
    } catch (error) {
      this.sendingOrder = false;
    }
  }

  handleOrderReady(orderId) {
    this.sessionService.submitOrderReady(orderId, this.sessionId).subscribe(
      (res) => {},
      (error) => {
        this.showToast(
          'error',
          'Error',
          'Could not mark order as ready. Please try again.',
          5000
        );
      }
    );
  }

  updateOrderLists(openOrderParms, readyOrderParms) {
    this.loadingOrders = true;
    const openOrders = this.sessionService.getSessionOrdersByStatus(
      this.sessionId,
      openOrderParms
    );
    const readyOrders = this.sessionService.getSessionOrdersByStatus(
      this.sessionId,
      readyOrderParms
    );

    forkJoin([openOrders, readyOrders])
      .pipe(take(1))
      .subscribe((results: any[]) => {
        this.openOrders = results[0].orders;
        this.readyOrders = results[1].orders;
        this.avgOrderTime = results[1].avgTime;
        this.openOrdersCount = results[0].count;
        this.readyOrdersCount = results[1].count;
        this.loadingOrders = false;
      });
  }

  getOpenSessionOrders() {
    const openOrderParms = { status: 'open' };
    this.sessionService
      .getOpenSessionOrders(this.sessionId, openOrderParms)
      .subscribe((res: any) => {
        this.openOrders = res;
      });
  }

  resetDefaultAndCurrentOrders() {
    this.selectedDiscount = null;
    this.currentOrder = {
      customerName: '',
      paid: null,
      change: 0,
      totalCost: 0,
      buzzerNumber: null,
      notes: null,
      sessionId: this.sessionId,
      discountId: null,
      items: this.sessionMenu.map((item: any) => {
        return {
          ...item,
          quantity: 0,
          totalCost: 0,
        };
      }),
    };
    this.defaultOrder = JSON.parse(JSON.stringify(this.currentOrder));
  }

  onTabChange(event) {
    this.activeTabIdx = event.index;
  }

  endSession() {
    this.sessionService.endSession(this.sessionId).subscribe((res) => {
      this.showToast('success', 'Success', 'Session completed.', 5000);
      setTimeout(() => {
        this.sessionInfo.status = 'complete';
        this.activeTabIdx = 2;
      }, 2000);
    });
  }

  showToast(severity, summary, detail, clearAfter) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
    setTimeout(() => {
      this.messageService.clear();
    }, clearAfter);
  }

  ngOnDestroy() {
    this.socketioService.leaveSessionRoom(this.sessionId);
  }
}
