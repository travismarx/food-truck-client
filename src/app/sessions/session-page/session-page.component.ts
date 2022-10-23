import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SessionsService } from '../sessions.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-session-page',
  templateUrl: './session-page.component.html',
  styleUrls: ['./session-page.component.scss'],
})
export class SessionPageComponent implements OnInit {
  sessionId!: number;
  loadingSession = false;
  sessionInfo!: any;
  sessionMenu!: any;
  currentOrder!: any;
  defaultOrder!: any;
  openOrders = [];

  menuItems = [
    {
      label: 'Send',
      // command: this.changeTab,
    },
    {
      label: 'Receive',
      // command: this.changeTab,
    },
    {
      label: 'Report',
      // command: this.changeTab,
    },
  ];
  activeTabLabel!: string;
  activeTab!: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionsService,
    private messageService: MessageService
  ) {}

  // changeTab(event: any) {
  //   console.log('change tab to: ', event);
  //   this.activeTabLabel = event.item.label;
  //   this.chgRef.detectChanges();
  // }

  ngOnInit(): void {
    this.activeTab = this.menuItems[0];
    // this.activeTabLabel = this.menuItems[0].label;
    this.loadingSession = true;
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.sessionId = +params.get('id')!;
      this.getOpenSessionOrders();
      this.sessionService
        .getSessionData(this.sessionId)
        .subscribe((res: any) => {
          this.loadingSession = false;
          console.log('session data res: ', res);
          this.sessionInfo = res.sessionInfo;
          this.sessionMenu = res.sessionMenu;
          this.currentOrder = {
            customerName: '',
            paid: null,
            change: 0,
            totalCost: 0,
            buzzerNumber: null,
            notes: '',
            sessionId: this.sessionId,
            items: res.sessionMenu.map((item: any) => {
              return {
                ...item,
                quantity: 0,
                totalCost: 0,
              };
            }),
          };
          this.defaultOrder = JSON.parse(JSON.stringify(this.currentOrder));
        });
    });
  }

  increaseQuantity(idx: number) {
    const item = this.currentOrder.items[idx];
    item.quantity++;
    item.totalCost = item.quantity * item.price;
    console.log('THIS DEFAULT: ', this.defaultOrder);
    this.calculateTotalOrderCost();
  }

  decreaseQuantity(idx: number) {
    const item = this.currentOrder.items[idx];
    item.quantity--;
    if (item.quantity < 0) item.quantity = 0;
    item.totalCost = item.quantity * item.price;
    this.calculateTotalOrderCost();
  }

  calculateTotalOrderCost() {
    this.currentOrder.totalCost = this.currentOrder.items.reduce(
      (a: any, b: any) => {
        return a + b.totalCost;
      },
      0
    );
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
    console.log('PAID: ', this.currentOrder.paid);
    console.log('COST: ', this.currentOrder.totalCost);
    this.currentOrder.change =
      this.currentOrder.paid - this.currentOrder.totalCost;
  }

  clearPaidInput() {
    this.currentOrder.paid = null;
    this.calculateChange();
  }

  clearBuzzerInput() {
    this.currentOrder.buzzerNumber = null;
  }

  sendOrder() {
    console.log('SENDING ORDER');
    console.log(this.currentOrder);
    try {
      this.sessionService.sendOrder(this.currentOrder).subscribe(
        (res) => {
          console.log('result on order send');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Order successfully submitted',
          });
          this.resetDefaultAndCurrentOrders();
          this.getOpenSessionOrders();
          setTimeout(() => {
            this.messageService.clear();
          }, 2000);
        },
        (error) => {
          console.log('subscription error occurred: ', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'An error occurred while submitting order. Please try again',
          });
          setTimeout(() => {
            this.messageService.clear();
          }, 3000);
        }
      );
    } catch (error) {
      console.log('error occurred: ', error);
    }
  }

  getOpenSessionOrders() {
    this.sessionService
      .getOpenSessionOrders(this.sessionId)
      .subscribe((res: any) => {
        console.log('OPEN SESSION ORDERS: ', res);
        this.openOrders = res;
      });
  }

  resetDefaultAndCurrentOrders() {
    this.currentOrder = {
      customerName: '',
      paid: null,
      change: 0,
      totalCost: 0,
      buzzerNumber: null,
      notes: '',
      sessionId: this.sessionId,
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
}
