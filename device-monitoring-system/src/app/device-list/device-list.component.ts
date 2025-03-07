import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiCOnfig } from '../core/api-config';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as d3 from 'd3';

@Component({
  selector: 'device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {
  @ViewChild('tableContainer', { static: true }) tableContainer!: ElementRef;

  // prepare api url to get device list
  deviceListUrl = ApiCOnfig.BASE_API_DEVICE_LIST;
  deviceList: string[] = [];


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    // inject dependancies
  }

  ngOnInit(): void {

    // populate device list during initialization
    this.getDeviceList().subscribe(
      {
        next: (devices) => {
          this.deviceList = devices;

          // crete d3-table after data gets available 
          this.createTable();

        },
        error: (err) => {
          console.log(err);
        }
      });
  }


  // GET request
  getDeviceList(): Observable<any> {
    return this.http.get(this.deviceListUrl);
  }


  private createTable(): void {
    const element = this.tableContainer.nativeElement;

    // Remove previous table if it exists
    d3.select(element).selectAll("*").remove();

    // Create table
    const table = d3.select(element)
      .append('table')
      .attr('class', 'd3-table');

    // Append table header
    table.append('thead')
      .append('tr')
      .append('th')
      .text('Device ID');

    // Append table body
    const tbody = table.append('tbody');

    // Append table rows
    const rows = tbody.selectAll('tr')
      .data(this.deviceList)
      .enter()
      .append('tr');

    // Append table cells with clickable router links
    rows.append('td')
      .append('a') // Create an `<a>` tag inside `<td>`
      .attr('href', d => `/events/${d}`) // Set Angular route
      .text(d => d)
      .on('click', (event, d) => {
        event.preventDefault(); // Prevent full-page reload
        this.router.navigate([`/events/${d}`]); // Navigate using Angular Router
      });
  }
}




