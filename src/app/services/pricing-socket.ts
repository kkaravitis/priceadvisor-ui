import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class PricingSocketService {
  private stompClient: Client;
  private pricingUpdates = new BehaviorSubject<any>(null);
  pricingUpdates$ = this.pricingUpdates.asObservable();

  constructor(cfg: AppConfigService) {
    const c = cfg.config;
    const wsUrl = `${c.apiBaseUrl}${c.wsPath}`;
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe("/stream/prices", (message: IMessage) => {
        const data = JSON.parse(message.body);
        this.pricingUpdates.next(data);
      });
    };

    this.stompClient.activate();
  }
}
