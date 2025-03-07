import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiCOnfig } from '../core/api-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

class DeviceDetail {
  timestamp!: number;
  partsPerMinute!: number;
  status!: string;
  deviceId!: string;
  order!: string;
};


@Component({
  selector: 'device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit {
  deviceId: any;

  // prepare api url to get device list
  deviceDetailstUrl = ApiCOnfig.BASE_API_DEVICE_DETAILS;
  deviceDetails: DeviceDetail[] = [];


  constructor(private route: ActivatedRoute, private http: HttpClient, private ngZone: NgZone) { }

  ngOnInit(): void {
    // get route param
    this.deviceId = this.route.snapshot.paramMap.get('deviceId');

    this.setDeviceDetails().subscribe({
      next: (data) => {
        this.deviceDetails.push(data);
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

}


