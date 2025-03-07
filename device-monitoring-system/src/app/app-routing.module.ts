import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceListComponent } from './device-list/device-list.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  { path: '', component: DeviceListComponent },
  { path: 'events/:deviceId', component: DeviceDetailsComponent }, // Route with parameter
  { path: 'order/:orderNumber', component: OrderDetailsComponent },
  { path: '**', component: DeviceListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
