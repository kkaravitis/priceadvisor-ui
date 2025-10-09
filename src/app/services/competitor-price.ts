import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppConfigService } from '../config/app-config.service';

export interface CompetitorPriceDto {
  productId: string;
  productName: string;
  competitorPrice: number;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompetitorPriceService {
  private readonly base: string;
  private readonly refreshSubject = new Subject<void>();
  readonly refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient, cfg: AppConfigService) { 
    const c = cfg.config;
    this.base = `${c.apiBaseUrl}${c.competitorApiPath}/competitor-prices`;
  }

  list(): Observable<CompetitorPriceDto[]> {
    return this.http.get<CompetitorPriceDto[]>(this.base);
  }

  upsert(payload: Partial<CompetitorPriceDto>) {
    return this.http.post(this.base, payload);
  }

  notifyRefresh(): void {
    this.refreshSubject.next();
  }
}
