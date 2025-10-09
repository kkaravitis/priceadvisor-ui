import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CompetitorPriceService, CompetitorPriceDto } from '../../services/competitor-price';
import { merge, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-competitor-table',
  templateUrl: './competitor-table.html',
  styleUrls: ['./competitor-table.css'],
  imports: [CommonModule, MatTableModule, DatePipe]
})
export class CompetitorTable implements OnInit {
  competitorPrices: CompetitorPriceDto[] = [];
  displayedColumns = ['productName', 'competitorPrice', 'updatedAt'];
  private destroy$ = new Subject<void>();

  constructor(private competitirPriceService: CompetitorPriceService) {}

  ngOnInit(): void {
    // Load initially and whenever the form announces a refresh
    merge(of(null), this.competitirPriceService.refresh$)
      .pipe(
        switchMap(() => this.competitirPriceService.list()),
        takeUntil(this.destroy$)
      )
      .subscribe(data => (this.competitorPrices = data));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByProductId = (_: number, row: CompetitorPriceDto) => row.productId;
}
