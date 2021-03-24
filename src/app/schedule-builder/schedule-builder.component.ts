import { HttpClient } from '@angular/common/http';
import { ScheduleService } from './../schedule.service';
import { Schedule } from './../Schedule';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray} from '@angular/forms';
import { SchedulePeriod } from '../SchedulePeriod';
import { Room } from '../Room';
import { Time } from '@angular/common';
import { splitAtColon } from '@angular/compiler/src/util';



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
  scheduleForm:FormGroup;
  list:number[] = [1,2,3,4,5];
  sched: Schedule;

  constructor(private httpClient: HttpClient, private fb:FormBuilder) {}

  ngOnInit()
  {
    this.sched = new Schedule(null);
    this.sched.name = "Test Schedule";
    this.sched.room = {roomWidth: 4, roomHeight: 5};
    this.sched.periods = [{id:1, startTime:{hours:11, minutes:44}, endTime:{hours:12, minutes:33}},
    {id:2, startTime:{hours:13, minutes:44}, endTime:{hours:15, minutes:6}},
    {id:3, startTime:{hours:5, minutes:24}, endTime:{hours:6, minutes:22}}]

    this.scheduleForm = this.fb.group({
      scheduleName: ['', Validators.required],
      room: this.fb.group({
        roomWidth: [''],
        roomHeight: ['']
      }),
      periods: this.fb.array([])
    });
    const fa = (this.scheduleForm.get('periods')as FormArray);
    this.addNewPeriod();
  }

  getPeriods(){
    return this.scheduleForm.get('periods');
  }

  addNewPeriod(){
    const fa = (this.scheduleForm.get('periods')as FormArray);
    fa.push(this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    }));
  }
  deletePeriod(i:number){
    const fa = (this.scheduleForm.get('periods')as FormArray);
    fa.removeAt(i);
    if(fa.length===0) this.addNewPeriod();
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
    //console.log(hoursAdj + ":" + minutesAdj);
    
    return (hoursAdj + ":" + minutesAdj);
  }

  onFormSubmit() {
    // TODO: Use EventEmitter with form value
    //console.log(this.scheduleForm.value);

    var newSchedule:Schedule;
    newSchedule = new Schedule(null);
    newSchedule.name = this.scheduleForm.value.scheduleName;
    newSchedule.periods = [];
    for (let period of this.scheduleForm.value.periods)
    {
      var start = period.startTime.toString().split(":",2);
      var end = period.endTime.toString().split(":",2);
      newSchedule.periods.push({startTime:{hours:parseInt(start[0]), minutes:parseInt(start[1])}, endTime:{hours:parseInt(end[0]), minutes:parseInt(end[1])}, intensity:1});
    }
    newSchedule.room = this.scheduleForm.value.room;

    console.log(newSchedule);
    this.httpClient
      .post<any>(this.SERVER_URL, newSchedule)
      .subscribe(res => console.log(res), err => console.log(err));

  }

  updateProfile() {
    this.scheduleForm.patchValue({
      scheduleName: 'Nancy',
      address: {
        street: '123 Drew Street'
      }
    });
  }

  getSchedule(){
    var json;
    this.httpClient
      .get<any>(this.SERVER_URL + "42")
      .subscribe(res => {
        json = res;
        console.log(json);
        this.sched = json;
      } , err => console.log(err));
    
    //return new Schedule(json);
    //this.sched = new Schedule(json);
  }

  onClick(){
    //this.list[this.list.length] = this.list.length;
    this.sched.periods.push(new SchedulePeriod);
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
