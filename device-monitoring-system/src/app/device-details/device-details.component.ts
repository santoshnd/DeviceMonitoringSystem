import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCOnfig } from '../core/api-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as d3 from 'd3';

class DeviceDetail {
  timestamp!: number;
  partsPerMinute!: number;
  status!: string;
  deviceId!: string;
  order!: string;
  [key: string]: any;
};


@Component({
  selector: 'device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;
  columns = ['timestamp', 'partsPerMinute', 'status', 'deviceId', 'order'];

  deviceId: any;

  // prepare api url to get device list
  deviceDetailstUrl = ApiCOnfig.BASE_API_DEVICE_DETAILS;
  deviceDetails: DeviceDetail[] = [];


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private ngZone: NgZone) { }

  ngOnInit(): void {
    // get route param
    this.deviceId = this.route.snapshot.paramMap.get('deviceId');

    this.setDeviceDetails().subscribe({
      next: (data) => {
        this.deviceDetails.push(data);

        // populate d3-table 
        this.createTable();

      },
      error: (err) => console.error('SSE Error:', err)
    });

  }


  setDeviceDetails(): Observable<any> {
    this.deviceDetailstUrl = this.deviceDetailstUrl + '/' + this.deviceId;

    return new Observable(observer => {
      const eventSource = new EventSource(this.deviceDetailstUrl);

      eventSource.onmessage = event => {
        this.ngZone.run(() => {
          observer.next(JSON.parse(event.data)); // Parse JSON data
        });
      };

      eventSource.onerror = error => {
        this.ngZone.run(() => {
          observer.error(error);
        });
        eventSource.close(); // Close connection on error
      };

      return () => {
        eventSource.close(); // Cleanup when unsubscribed
      };
    });
  }

  private createTable(): void {
    const element = this.tableContainer.nativeElement;

    // Remove previous table if exists
    d3.select(element).selectAll("*").remove();

    // Create table
    const table = d3.select(element)
      .append('table')
      .attr('class', 'd3-table');

    // Append table header
    const thead = table.append('thead').append('tr');
    thead.selectAll('th')
      .data(['Timestamp', 'Parts Per Minute', 'Status', 'Device Id', 'Order'])
      .enter()
      .append('th')
      .text(d => d);

    // Append table body
    const tbody = table.append('tbody');

    // Append table rows
    const rows = tbody.selectAll('tr')
      .data(this.deviceDetails)
      .enter()
      .append('tr');

    // Append table cells
    rows.selectAll('td')
      .data(d => [...this.columns.slice(0, -1).map(col => d[col]), d.order])
      .enter()
      .append('td')
      .each((d, i, nodes) => {
        const cell = d3.select(nodes[i]);

        if (i === 4) { // Last column - Order Details
          cell.append('button')
            .text(d)
            .attr('class', 'order-button')
            .on('click', () => {
              this.router.navigate(['/order', d]); // Navigate programmatically
            });
        } else {
          cell.text(d);
        }
      });
  }
}


