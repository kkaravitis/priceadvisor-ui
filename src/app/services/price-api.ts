import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private baseUrl = 'http://localhost:8080/pricing-api';

  constructor(private http: HttpClient) {}

  getLatest(): Observable<PricingResult[]> {
    return this.http.get<PricingResult[]>(`${this.baseUrl}/prices/latest`);
  }
}