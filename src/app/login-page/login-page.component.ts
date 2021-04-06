import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Device} from '../Device';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray, Form} from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  position:number[] = [250,520,250,200,630,130];
  constructor(private httpClient: HttpClient, private router:Router,private fb:FormBuilder) { }
  SERVER_URL: string = 'https://luxo-api-test.azurewebsites.net/api/Devices/';
  SECURE_URL: string = 'https://luxo-api-test.azurewebsites.net/api/SecureDevices';
  loginForm:FormGroup;
  LOGIN_URL: string  = 'https://luxo-api-test.azurewebsites.net/api/Login';
  token: string;
  ngOnInit(): void {

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
        this.router.navigate(['/devices'], {state: {data: {token : this.token}}});
      });
      });
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
