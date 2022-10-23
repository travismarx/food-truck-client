import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(private http: HttpClient) {}

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

  getOpenSessionOrders(sessionId: number) {
    return this.http.get(`${environment.apiRoot}/orders/session/${sessionId}`);
  }
}
