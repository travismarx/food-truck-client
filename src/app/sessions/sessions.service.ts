import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SocketioService } from '../services/socketio.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  newOrderAdded$: Observable<any>;

  constructor(private http: HttpClient, socketio: SocketioService) {
    this.newOrderAdded$ = socketio.listen('new-order');
  }

  getSessionOptions() {
    return this.http.get(`${environment.apiRoot}/sessions/options`);
  }

  getOpenSessions() {
    return this.http.get(`${environment.apiRoot}/sessions/status/open`);
  }

  startNewSession(newSessionBody: {
    sessionTypeId: number;
    sessionTitle: string;
    menu: any;
  }) {
    return this.http.post(`${environment.apiRoot}/sessions`, newSessionBody);
  }

  getMenuOptions() {
    return this.http.get(`${environment.apiRoot}/menus`);
  }

  getSessionData(sessionId: number) {
    return this.http.get(`${environment.apiRoot}/sessions/${sessionId}`);
  }

  sendOrder(order: any) {
    return this.http.post(`${environment.apiRoot}/orders/`, order);
  }

  getOpenSessionOrders(
    sessionId: number,
    params: { status?: string; skip?: number; limit?: number }
  ) {
    let httpParams = new HttpParams();
    for (let [key, value] of Object.entries(params)) {
      httpParams = httpParams.append(key, value);
    }
    return this.http.get(`${environment.apiRoot}/orders/session/${sessionId}`, {
      params: httpParams,
    });
  }

  getSessionOrdersByStatus(
    sessionId: number,
    params: { status?: string; skip?: number; limit?: number }
  ) {
    let httpParams = new HttpParams();
    for (let [key, value] of Object.entries(params)) {
      httpParams = httpParams.append(key, value);
    }
    return this.http.get(`${environment.apiRoot}/orders/session/${sessionId}`, {
      params: httpParams,
    });
  }

  submitOrderReady(orderId: number, sessionId: number) {
    return this.http.put(`${environment.apiRoot}/orders/${orderId}`, {
      status: 'ready',
      sessionId,
    });
  }

  getSessionReport(sessionId: number) {
    return this.http.get(`${environment.apiRoot}/sessions/report/${sessionId}`);
  }

  endSession(sessionId: number) {
    return this.http.put(
      `${environment.apiRoot}/sessions/${sessionId}/complete`,
      null
    );
  }

  searchSessions(searchDate: string, text: string) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('date', searchDate);
    httpParams = httpParams.append('text', text);

    return this.http.get(`${environment.apiRoot}/sessions/search`, {
      params: httpParams,
    });
  }
}
