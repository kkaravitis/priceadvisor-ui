import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

export interface PricingResult {
  timestamp: string;
  productId: string;
  productName: string;
  price: number;
  currency: string;
  demandMetric?: number;
  competitorPrice?: number;
  inventoryLevel?: number;
  priceChangePercent?: number;
  justArrived?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PriceApiService {
  private readonly base: string;

  constructor(private http: HttpClient, cfg: AppConfigService) {
    const c = cfg.config;
    this.base = `${c.apiBaseUrl}${c.pricingApiPath}`;
  }

  getLatest(): Observable<PricingResult[]> {
    return this.http.get<PricingResult[]>(`${this.base}/prices/latest`);
  }
}