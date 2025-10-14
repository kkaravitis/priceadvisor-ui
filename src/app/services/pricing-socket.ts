import { Injectable, NgZone } from '@angular/core';
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

  constructor(private zone: NgZone, cfg: AppConfigService) {
    const c = cfg.config;
    const wsUrl = `${c.apiBaseUrl}${c.wsPath}`;
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe("/stream/prices/", (message: IMessage) => {
        
        const data = JSON.parse(message.body);
        console.log('Received socket price update:', data);

        this.zone.run(() => {
          this.pricingUpdates.next(data);
        });

      });
    };

    this.stompClient.activate();
  }
}
