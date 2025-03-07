import { Component, OnInit } from '@angular/core';
import { ApiCOnfig } from '../core/api-config';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})
export class DeviceListComponent implements OnInit {

  // prepare api url to get device list
  deviceListUrl = ApiCOnfig.BASE_API_DEVICE_LIST;
  deviceList: string[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    // inject dependancies
  }

  ngOnInit(): void {

    // populate device list during initialization
    this.getDeviceList().subscribe(
      {
        next: (devices) => {
          this.deviceList = devices;
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
}