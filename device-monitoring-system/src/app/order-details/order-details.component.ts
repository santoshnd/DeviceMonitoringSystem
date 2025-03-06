import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderNumber: any; // todo: number or string type ??

  orderDetails = {"orderNumber":"15","productionTarget":138465,"productionState":9953};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderNumber = this.route.snapshot.paramMap.get('orderNumber'); // Get parameter

    console.log('this.order = ', this.orderNumber );
  }
  
}
