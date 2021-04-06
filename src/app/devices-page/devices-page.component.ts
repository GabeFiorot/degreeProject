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
  devices:Device[];
  SERVER_URL: string = 'https://luxo-api-test.azurewebsites.net/api/Devices/';
  SECURE_URL: string = 'https://luxo-api-test.azurewebsites.net/api/SecureDevices';
  loginForm:FormGroup;
  LOGIN_URL: string  = 'https://luxo-api-test.azurewebsites.net/api/Login';
  token: string;
  ngOnInit(): void {
    this.devices = [];
    //this.getDevices();
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  tryLogin()
  {
    var username = this.loginForm.get('username').value;
    var password = this.loginForm.get('password').value;
    var json;
    var url = this.LOGIN_URL + '?username=' + username + '&hashpass=';
    //console.log(this.sha256(password));
    /*
    this.httpClient
      .get<any>(this.LOGIN_URL)
      .subscribe(res => {
        json = res;
        console.log(json);
        
      } , err => console.log(err));
      */
      this.sha256(password).then(hash => {
        //console.log(url + hash)
        this.httpClient
          .get<any>(url + hash)
          .subscribe(res => {
            json = res;
            console.log("json" + json);
        
      } , err => {
        console.log(err.error.text)
        this.token = err.error.text;
        this.getDevicesSecure();
      });
      });
  }

  goToSchedules(): void {
    this.router.navigate(['/schedule'], {state: {data: {myData : 'example_data'}}});
}

  editDevice(i:number)
  {
    var deviceId = this.devices[i].deviceId;
    this.router.navigate(['/schedule'], {state: {data: {deviceIndex : deviceId}}});
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

   async sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
}

}
