import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

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
  private readonly base = 'http://localhost:8080/competitor-api/competitor-prices';

  private refreshSubject = new Subject<void>();
  readonly refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) { }

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
