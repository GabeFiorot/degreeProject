import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Device} from '../Device';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray, Form} from '@angular/forms';
@Component({
  selector: 'app-devices-page',
  templateUrl: './devices-page.component.html',
  styleUrls: ['./devices-page.component.css']
})
export class DevicesPageComponent implements OnInit {

  constructor(private httpClient: HttpClient, private router:Router,private fb:FormBuilder) { }

  position:number[] = [250,520,250,200,630,130];
  devices:Device[];
  SERVER_URL: string = 'https://luxo-api-test.azurewebsites.net/api/Devices/';
  SECURE_URL: string = 'https://luxo-api-test.azurewebsites.net/api/SecureDevices';
  loginForm:FormGroup;
  //LOGIN_URL: string  = 'https://luxo-api-test.azurewebsites.net/api/Login';
  token: string;
  ngOnInit(): void {
    this.devices = [];
    //this.getDevices();
    this.token = history.state.data.token;
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.getDevicesSecure();
  }


  goToSchedules(): void {
    this.router.navigate(['/schedule'], {state: {data: {myData : 'example_data'}}});
}

  editDevice(i:number)
  {
    var deviceId = this.devices[i].deviceId;
    this.router.navigate(['/schedule'], {state: {data: {deviceIndex : deviceId, token : this.token}}});
  }

  getDevicesSecure()
  {
    var json;
        this.httpClient
      .get<any>(this.SECURE_URL + '?token=' + this.token)
      .subscribe(res => {
        json = res;
        console.log("getting devices securely")
        console.log(json);
        this.devices = json; // update the current sched AFTER the api gets back to you
        //this.populateForm(json);
      } , err => console.log(err));
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
