import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {CompetitorPriceService} from '../../services/competitor-price';

@Component({
  standalone: true,
  selector: 'app-competitor-price-updater',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './competitor-price-updater.html',
  styleUrl: './competitor-price-updater.css'
})
export class CompetitorPriceUpdater {

  submissionMessage = '';
  isSuccess = true;

  priceForm: FormGroup;
  submitting = false;
  productOptions = [
      { id: 'iphone-15-pro', name: 'Apple iPhone 15 Pro' },
      { id: 'galaxy-s24', name: 'Samsung Galaxy S24' },
      { id: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5 Headphones' },
      { id: 'dell-xps-13', name: 'Dell XPS 13 Laptop' },
      { id: 'logitech-mx-master-3', name: 'Logitech MX Master 3 Mouse' }
  ];

  constructor(private fb: FormBuilder, private competitorPriceService: CompetitorPriceService) {
    this.priceForm = this.fb.group({
      productId: ['', Validators.required],
      competitorPrice: [null, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit() {
    if (this.priceForm.invalid) return;

    const selectedProduct = this.productOptions.find(
      p => p.id === this.priceForm.value.productId
    );

    const payload: any = { 
      productId: this.priceForm.value.productId,
      productName: selectedProduct?.name,
      competitorPrice: this.priceForm.value.competitorPrice
    }

    this.competitorPriceService.upsert(payload).subscribe({
      next: () => {
        this.competitorPriceService.notifyRefresh();      // 👈 tell the table to reload
        this.priceForm.reset();
        this.submitting = false;
      },
      error: err => {
        this.submitting = false;
        this.submissionMessage = 'Error updating price: ' + (err?.message ?? 'Unknown error');
        this.isSuccess = false;
      }
    });
  }

}
