import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PricingSocketService {
  private stompClient: Client;
  private pricingUpdates = new BehaviorSubject<any>(null);
  pricingUpdates$ = this.pricingUpdates.asObservable();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      const tenantId = 'eshop-demo';
      this.stompClient.subscribe("/stream/prices", (message: IMessage) => {
        const data = JSON.parse(message.body);
        this.pricingUpdates.next(data);
      });
    };

    this.stompClient.activate();
  }
}
