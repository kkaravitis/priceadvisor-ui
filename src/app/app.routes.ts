import { Routes } from '@angular/router';
import { PricingLiveComponent } from './components/pricing-live/pricing-live';

export const routes: Routes = [
  { path: 'live', component: PricingLiveComponent },
  { path: '', redirectTo: '/live', pathMatch: 'full' },
  { path: '**', redirectTo: '/live' }
];