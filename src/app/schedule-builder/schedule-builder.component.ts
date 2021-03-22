import { HttpClient } from '@angular/common/http';
import { ScheduleService } from './../schedule.service';
import { Schedule } from './../Schedule';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SchedulePeriod } from '../SchedulePeriod';
import { Room } from '../Room';
import { Time } from '@angular/common';



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
  sched: Schedule;
  ngOnInit()
  {
    this.sched = new Schedule();
   this.sched.name = "Test Schedule";
   this.sched.room = {roomWidth: 4, roomHeight: 5};
   this.sched.periods = [{id:1, startTime:{hours:11, minutes:44}, endTime:{hours:12, minutes:33}},
    {id:2, startTime:{hours:13, minutes:44}, endTime:{hours:15, minutes:6}},
    {id:3, startTime:{hours:5, minutes:24}, endTime:{hours:6, minutes:22}}]
  }

  makeTime(time:Time)
  {
    var hoursAdj = "";
    var minutesAdj = "";
    if(time.hours<10)
    {
      hoursAdj = "0" + time.hours.toString();
    }else{
      hoursAdj = time.hours.toString();
    }
    if(time.minutes<10)
    {
      minutesAdj = "0" + time.minutes.toString();
    }else{
      minutesAdj = time.minutes.toString();
    }
    console.log(hoursAdj + ":" + minutesAdj);
    
    return (hoursAdj + ":" + minutesAdj);
  }

  onClick(){
    //this.list[this.list.length] = this.list.length;
    this.sched.periods.push(new SchedulePeriod)
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
