import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionsComponent } from './sessions.component';
import { SessionsService } from './sessions.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SessionPageComponent } from './session-page/session-page.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { OrderSendComponent } from './order-send/order-send.component';
import { OrderReceiveComponent } from './order-receive/order-receive.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SlideMenuModule } from 'primeng/slidemenu';
import { CacheInterceptor } from '../cache-interceptor.ts/cache-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SessionReportComponent } from './session-report/session-report.component';
import { SessionOptionsComponent } from './session-options/session-options.component';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SessionLookupComponent } from './session-lookup/session-lookup.component';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
  declarations: [
    SessionsComponent,
    SessionPageComponent,
    OrderSendComponent,
    OrderReceiveComponent,
    SessionReportComponent,
    SessionOptionsComponent,
    SessionLookupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    InputSwitchModule,
    TableModule,
    CheckboxModule,
    ProgressSpinnerModule,
    InputNumberModule,
    TabMenuModule,
    TabViewModule,
    ToastModule,
    SlideMenuModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    CalendarModule,
    PaginatorModule,
  ],
  providers: [
    SessionsService,
    MessageService,
    ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
})
export class SessionsModule {}
