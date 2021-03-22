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
  
  schedule = { startTime: 111, endTime: 222, name: "baseval" , room : { roomwidth : 0, roomheight : 0}};
  //schedule: Schedule;
  constructor(private httpClient: HttpClient) { }
  list:number[] = [1,2,3,4,5];
  ngOnInit()
  {
   
  }

  onClick(){
    this.list[this.list.length] = this.list.length;
  }

  onSubmit(event: any) {
    this.schedule.name = event.target.nameInput.value;
    console.log(event.target.start.value);
    this.schedule.startTime = event.target.start.value;
    this.schedule.endTime = event.target.end.value;
    this.schedule.room = {roomwidth : event.target.roomwidth.value, roomheight : event.target.roomheight.value}
    console.log(this.schedule);
    /*
    this.httpClient
      .post<any>(this.SERVER_URL, this.schedule)
      .subscribe(res => console.log(res), err => console.log(err));
      */
  } 
}
