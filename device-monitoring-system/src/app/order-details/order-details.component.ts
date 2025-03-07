import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCOnfig } from '../core/api-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

class OrderDetail {
  orderNumber!: string;
  productionTarget!: number;
  productionState!: number;
};

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderNumber: any;

  // prepare api url to get device list
  orderDetailsUrl = ApiCOnfig.BASE_API_ORDER_DETAILS;
  orderDetails: OrderDetail = { orderNumber: '', productionTarget: 0, productionState: 0 }

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.orderNumber = this.route.snapshot.paramMap.get('orderNumber'); // Get parameter

    // populate order details
    this.getOrderDetails().subscribe(
      {
        next: (details) => {
          this.orderDetails = details;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  // GET request
  getOrderDetails(): Observable<any> {
    this.orderDetailsUrl = this.orderDetailsUrl + '/' + this.orderNumber;

    return this.http.get(this.orderDetailsUrl);
  }

}
