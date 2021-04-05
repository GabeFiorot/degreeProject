import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Device} from '../Device';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-devices-page',
  templateUrl: './devices-page.component.html',
  styleUrls: ['./devices-page.component.css']
})
export class DevicesPageComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router:Router) { }
  devices:Device[];
  SERVER_URL: string = 'https://luxo-api-test.azurewebsites.net/api/Devices/';

  ngOnInit(): void {
    this.devices = [];
    this.getDevices();
  }

  goToSchedules(): void {
    this.router.navigate(['/schedule'], {state: {data: {myData : 'example_data'}}});
}

  editDevice(i:number)
  {
    var deviceId = this.devices[i].deviceId;
    this.router.navigate(['/schedule'], {state: {data: {deviceIndex : deviceId}}});
  }

  getDevices()
  {
    var json;
        this.httpClient
      .get<any>(this.SERVER_URL)
      .subscribe(res => {
        json = res;
        //console.log(json);
        this.devices = json; // update the current sched AFTER the api gets back to you
        //this.populateForm(json);
      } , err => console.log(err));
  }

}
