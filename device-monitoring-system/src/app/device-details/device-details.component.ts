import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss']
})
export class DeviceDetailsComponent implements OnInit{
  deviceId: any; // todo: number or string type ??

  deviceEvents = [
    { data: { "timestamp": 1741250949676, "partsPerMinute": 77.98252962718018, "status": "maintenance", "deviceId": "4229", "order": "15" } },

    {
      data: { "timestamp": 1741251233259, "partsPerMinute": 77.15702380252208, "status": "running", "deviceId": "4229", "order": "15" },
    },
    {
      data: { "timestamp": 1741251237259, "partsPerMinute": 78.20422525512501, "status": "running", "deviceId": "4229", "order": "15" },
    },
    {
      data: { "timestamp": 1741251241260, "partsPerMinute": 79.18984137516455, "status": "running", "deviceId": "4229", "order": "15" },
    },
    {
      data: { "timestamp": 1741251244260, "partsPerMinute": 80.05303673945646, "status": "running", "deviceId": "4229", "order": "15" },
    },
    {
      data: { "timestamp": 1741251248261, "partsPerMinute": 80.36610485446876, "status": "running", "deviceId": "4229", "order": "15" }
    }
  ];


  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.deviceId = this.route.snapshot.paramMap.get('deviceId'); // Get parameter
  }

}
