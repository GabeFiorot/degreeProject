import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  position:number[] = [250,520,250,200,630,130];
  constructor() { }

  ngOnInit(): void {
  }

}
