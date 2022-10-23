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
import { MessageService } from 'primeng/api';
import { CacheInterceptor } from '../cache-interceptor.ts/cache-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    SessionsComponent,
    SessionPageComponent,
    OrderSendComponent,
    OrderReceiveComponent,
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
  ],
  providers: [
    SessionsService,
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
})
export class SessionsModule {}
