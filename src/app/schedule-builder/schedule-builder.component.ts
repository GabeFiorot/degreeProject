import { HttpClient } from '@angular/common/http';
import { ScheduleService } from './../schedule.service';
import { Schedule } from './../Schedule';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-schedule-builder',
  templateUrl: './schedule-builder.component.html',
  styleUrls: ['./schedule-builder.component.css'],
  
})

export class ScheduleBuilderComponent implements OnInit
{
  SERVER_URL: string = 'https://luxo-api-test.azurewebsites.net/api/Schedules/';
  
  schedule = { startTime: 111, endTime: 222, name: "baseval" };

  constructor(private httpClient: HttpClient) { }

  ngOnInit()
  {
   
  }

  onSubmit(event: any) {
    this.schedule.name = event.target.nameInput.value;
    this.schedule.startTime = +event.target.start.value;
    this.schedule.endTime = +event.target.end.value;
    console.log(this.schedule);
    this.httpClient
      .post<any>(this.SERVER_URL, this.schedule)
      .subscribe(res => console.log(res), err => console.log(err));
  } 
}
