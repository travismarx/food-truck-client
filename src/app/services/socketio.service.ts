import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { EnvironmentInjector } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  newOrderAdded$: Observable<any>;
  connected$ = new BehaviorSubject<boolean>(false);

  socket;

  constructor() {}

  setupSocketConnection() {
    this.socket = io(environment.socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
    });
    this.socket.on('connect', () => {
      // this.listenForOrders();
      return this.connected$.next(true);
    });
    this.socket.on('disconnect', () => this.connected$.next(false));
    if (this.socket) {
      // console.log('the socket: ', this.socket);
    }
  }

  joinSessionRoom(sessionId) {
    this.socket.emit('joinSessionRoom', sessionId);
  }

  leaveSessionRoom(sessionId) {
    this.socket.emit('leaveSessionRoom', sessionId);
  }

  listenForOrders() {
    // console.log('listen for orders');
    // this.socket.on('new-order', (data) => {
    // console.log('NEW ORDER DATA: ', data);
    // });
  }

  listen(event: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(event, (data) => {
        // console.group();
        // console.log("----- SOCKET INBOUND -----");
        // console.log("Action: ", event);
        // console.log("Payload: ", data);
        // console.groupEnd();

        observer.next(data);
      });
      // dispose of the event listener when unsubscribed
      return () => this.socket.off(event);
    });
  }
}
