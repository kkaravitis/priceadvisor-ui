import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table'
import { PriceApiService, PricingResult } from '../../services/price-api';
import { PricingSocketService } from '../../services/pricing-socket';
import { EventSender } from '../event-sender/event-sender';
import { CompetitorTable } from '../competitor-table/competitor-table';
import { CompetitorPriceUpdater } from '../competitor-price-updater/competitor-price-updater';

@Component({
  standalone: true,
  selector: 'app-pricing-live',
  templateUrl: './pricing-live.html',
  styleUrls: ['./pricing-live.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    DatePipe,
    DecimalPipe,
    EventSender,
    CompetitorTable,
    CompetitorPriceUpdater
  ]
})
export class PricingLiveComponent implements OnInit {
  currentYear = new Date().getFullYear();
  
  pricingResults: PricingResult[] = [];

  pricingResultsMap = new Map<string, PricingResult>();

  displayedColumns: string[] = [
    'productId',
    'productName',
    'price',
    'priceChangePercent',
    'demandMetric'
  ];

  constructor(private priceApiService: PriceApiService,
    private pricingSocketService: PricingSocketService) {}

  ngOnInit(): void {
    this.priceApiService.getLatest().subscribe(initialData => {
      initialData.forEach((pricingResult) => {
        this.pricingResultsMap.set(pricingResult.productId, pricingResult);
      })

      this.pricingResults = initialData;
    });

    this.pricingSocketService.pricingUpdates$.subscribe(data => {
      if (data && data.productId) {
          this.pricingResultsMap.set(data.productId, {
            ...data,
            justArrived: true
          });

          this.pricingResults = Array
          .from(this.pricingResultsMap.values())
          .sort((a, b) => a.productId.localeCompare(b.productId));

          this.pricingResults = Array.from(this.pricingResultsMap.values());

          // Remove justArrived flag after 3 seconds
          setTimeout(() => {
            const updated = this.pricingResultsMap.get(data.productId);
            if (updated) {
              this.pricingResultsMap.set(data.productId, {
                ...updated,
                justArrived: false
              });
              this.pricingResults = Array.from(this.pricingResultsMap.values())
                .sort((a, b) => a.productId.localeCompare(b.productId));
            }
          }, 3000);
        }
    });
  }
}
