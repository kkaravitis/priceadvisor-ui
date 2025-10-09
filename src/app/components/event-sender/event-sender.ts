import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export enum EventType {
  Click = 'ClickEvent',
  InventoryLevel = 'InventoryEvent',
  BusinessRule = 'BusinessRuleEvent',
  Order = 'Order'
}

@Component({
  standalone: true,
  selector: 'app-event-sender',
  templateUrl: './event-sender.html',
  styleUrls: ['./event-sender.css'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class EventSender {
  eventForm: FormGroup;

  EventType = EventType;

  apiEndpointMap = new Map<string, string>([
    [EventType.Click, '/click'],
    [EventType.InventoryLevel, '/inventory'],
    [EventType.Order, '/order'],
    [EventType.BusinessRule, '/rule'],
  ]);

  eventTypes = [
    {id: EventType.Click, name: 'Click Event'}, 
    {id: EventType.InventoryLevel, name: 'Inventory Level'}, 
    {id: EventType.BusinessRule, name: 'Business Rule (Mn/Max Price)'},
    {id: EventType.Order, name: 'Order'} 
  ];

  products = [
      { id: 'iphone-15-pro', name: 'Apple iPhone 15 Pro' },
      { id: 'galaxy-s24', name: 'Samsung Galaxy S24' },
      { id: 'sony-wh-1000xm5', name: 'Sony WH-1000XM5 Headphones' },
      { id: 'dell-xps-13', name: 'Dell XPS 13 Laptop' },
      { id: 'logitech-mx-master-3', name: 'Logitech MX Master 3 Mouse' }
    ];

  submissionMessage = '';
  isSuccess = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.eventForm = this.fb.group({
      type: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: [''],
      min: [''],
      max: ['']
    });


    this.eventForm.get('type')?.valueChanges.subscribe((type) => {
      this.submissionMessage = '';
      
      this.updateValidators(type);
    });


  }

  onSubmit() {
    if (this.eventForm.invalid) return;

    const type = this.eventForm.value.type;

    const selectedProduct = this.products.find(
      p => p.id === this.eventForm.value.productId
    );
    
    const payload: any = { 
        productId: this.eventForm.value.productId,
        productName: selectedProduct?.name
      };

    // Enrich based on type

    switch(type) {
      case EventType.InventoryLevel:
        payload.quantity = this.eventForm.value.quantity;
        break;
      case EventType.Order:
        payload.quantity = this.eventForm.value.quantity;
        break;
      case EventType.BusinessRule:
        payload.min = this.eventForm.value.min;
        payload.max = this.eventForm.value.max;
        break;
    }

    if (type === EventType.InventoryLevel) {
      payload.quantity = this.eventForm.value.quantity;
    } else if (type === EventType.BusinessRule) {
      payload.ruleName = this.eventForm.value.ruleName;
    }



    const apiUrl = "http://localhost:8080/pricing-api/events" + this.apiEndpointMap.get(type);
    if (!apiUrl) {
      throw new Error(`No API URL mapped for event type: ${type}`);
    }

    this.http.post(apiUrl, payload).subscribe({
      next: () => {
        this.submissionMessage = '✅ Event sent successfully!';
        this.isSuccess = true;
        this.eventForm.reset(); // optional: reset form
      },
      error: err => {
        this.submissionMessage = `❌ Error: ${err.message}`;
        this.isSuccess = false;
      }
    });
  }





private updateValidators(type: string) {
  const quantity = this.eventForm.get('quantity');
  const min = this.eventForm.get('min');
  const max = this.eventForm.get('max');

  // Clear all validators first
  quantity?.clearValidators();
  min?.clearValidators();
  max?.clearValidators();

  // Set validators based on type
  if (type === EventType.InventoryLevel || type == EventType.Order) {
    quantity?.setValidators([Validators.required, Validators.min(0)]);
  } else if (type === EventType.BusinessRule) {
    min?.setValidators([Validators.required]);
    max?.setValidators([Validators.required]);
  }

  // Update validity
  quantity?.updateValueAndValidity();
  min?.updateValueAndValidity();
  max?.updateValueAndValidity();
}






}