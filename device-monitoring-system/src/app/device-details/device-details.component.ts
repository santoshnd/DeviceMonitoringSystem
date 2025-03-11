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
  @ViewChild('chartContainerPpm', { static: true }) chartContainerPpm!: ElementRef;

  columns = ['timestamp', 'partsPerMinute', 'status', 'deviceId', 'order'];
  deviceId: any;

  // prepare api url to get device list
  deviceDetailstUrl = ApiCOnfig.BASE_API_DEVICE_DETAILS;
  deviceDetails: DeviceDetail[] = [];

  // chart properties
  private margin = { top: 20, right: 30, bottom: 30, left: 60 };
  private width = (window.innerWidth * 0.8) - this.margin.left - this.margin.right;
  private height = (window.innerHeight * 0.50) - this.margin.top - this.margin.bottom;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient, private el: ElementRef, private ngZone: NgZone) { }

  ngOnInit(): void {
    // get route param
    this.deviceId = this.route.snapshot.paramMap.get('deviceId');

    this.setDeviceDetails().subscribe({
      next: (data) => {
        this.deviceDetails.push(data);

        // create d3-chart
        this.createChart();

        // create d3-table 
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
            .attr('class', 'button-order')
            .on('click', () => {
              this.router.navigate(['/order', d]); // Navigate programmatically
            });
        } else {
          cell.text(d);
          if (i === 2) { //Status column 
            cell.style('background-color', d === 'running' ? 'green' : (d === 'stopped') ? 'red' : ''); // Color status
          }
        }
      });
  }

  onHomeClick() {
    // default Home route
    this.router.navigate(['']);
  }


  private createChart() {
    const element = this.chartContainerPpm.nativeElement;

    // Remove previous chart if exists
    d3.select(element).selectAll("*").remove();

    const svg = d3.select(element)
      .append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

    // Define scales
    const x = d3.scaleTime()
      // .domain(d3.extent(this.data, d => d.timestamp) as [Date, Date]) // Ensure proper type
      .domain(d3.extent(this.deviceDetails, d => d.timestamp) as unknown as [Date, Date]) // Ensure proper type

      .range([0, this.width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(this.deviceDetails, d => d.partsPerMinute) as [number, number]) // Ensure proper type
      .range([this.height, 0]);

    // Define line generator
    const line = d3.line<any>()
      .x(d => x(d.timestamp))
      .y(d => y(d.partsPerMinute));

    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x).ticks(5));

    // Add X-axis label
    svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", this.height + this.margin.bottom - 5) // Position below x-axis
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "brown")
      .style("font-weight", "bold")
      .text("Timestamp");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -this.height / 2)
      .attr("y", -this.margin.left + 15) // Position left of y-axis
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "brown")
      .style("font-weight", "bold")
      .text("Parts Per Minute");

    // Add the line
    svg.append("path")
      .datum(this.deviceDetails)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  }
}

