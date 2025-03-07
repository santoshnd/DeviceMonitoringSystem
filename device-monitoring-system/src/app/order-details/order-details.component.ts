import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCOnfig } from '../core/api-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as d3 from 'd3';

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
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;
  columns = ['Order Number', 'Production Target', 'Production State'];
  orderNumber: any;

  // prepare api url to get device list
  orderDetailsUrl = ApiCOnfig.BASE_API_ORDER_DETAILS;
  orderDetails: OrderDetail = { orderNumber: '', productionTarget: 0, productionState: 0 }

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.orderNumber = this.route.snapshot.paramMap.get('orderNumber'); // Get parameter

    // populate order details
    this.getOrderDetails().subscribe(
      {
        next: (details) => {
          this.orderDetails = details;

          // populate d3-table
          this.createTable();
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

  private createTable(): void {
    const element = this.tableContainer.nativeElement;

    // Remove previous table if it exists
    d3.select(element).selectAll("*").remove();

    // Create table
    const table = d3.select(element)
      .append('table')
      .attr('class', 'd3-table');

    // Add table headers
    const headers = this.columns;
    table.append('thead')
      .append('tr')
      .selectAll('th')
      .data(headers)
      .enter()
      .append('th')
      .text(d => d);

    // Add table body and rows
    const tbody = table.append('tbody');

    const rows = tbody.selectAll('tr')
      .data([this.orderDetails])
      .enter()
      .append('tr');

    // Add cells
    rows.selectAll('td')
      .data(row => Object.values(row))
      .enter()
      .append('td')
      .text(d => d);
  }

  onHomeClick() {
    // default Home route
    this.router.navigate(['']); 
  }

}
