import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'app-session-report',
  templateUrl: './session-report.component.html',
  styleUrls: ['./session-report.component.scss'],
})
export class SessionReportComponent implements OnInit {
  @Input() sessionId: number;
  @Input() readyOrders: any;
  @Input() readyOrdersCount: number;
  @Input() loadingReadyOrders;

  @Output() onReadyOrdersPaginate = new EventEmitter();

  loading = false;
  menuItemTotals;
  sessionInfo;

  constructor(private sessionService: SessionsService) {}

  ngOnInit(): void {
    this.getReport();
  }

  getReport() {
    this.loading = true;
    this.sessionService
      .getSessionReport(this.sessionId)
      .subscribe((res: any) => {
        // console.log('RES FOR SESSION REPORT - ', res);
        this.loading = false;
        this.menuItemTotals = res.menuItemTotals;
        this.sessionInfo = res.sessionInfo;
      });
  }

  paginate(event) {
    // console.log('event on paginate: ', event);
    this.onReadyOrdersPaginate.emit(event);
  }
}
