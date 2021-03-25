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
  scheduleForm:FormGroup;
  list:number[] = [1,2,3,4,5];
  sched: Schedule;

  constructor(private httpClient: HttpClient, private fb:FormBuilder) {}

  ngOnInit()
  {
    this.sched = new Schedule(null);
    this.sched.periods = [];

    /*
    // initial schedule if 
    this.sched.name = "Test Schedule";
    this.sched.room = {roomWidth: 4, roomHeight: 5};
    this.sched.periods = [{id:1, startTime:{hours:11, minutes:44}, endTime:{hours:12, minutes:33}},
    {id:2, startTime:{hours:13, minutes:44}, endTime:{hours:15, minutes:6}},
    {id:3, startTime:{hours:5, minutes:24}, endTime:{hours:6, minutes:22}}]
    */

    this.scheduleForm = this.fb.group({
      scheduleName: ['', Validators.required],
      deviceId: [''],
      delay: [''],
      intensity: [''],
      sensorPort: [''],
      lightPort: [''],
      room: this.fb.group({
        roomWidth: [''],
        roomHeight: ['']
      }),
      periods: this.fb.array([])
    });
    const fa = (this.scheduleForm.get('periods')as FormArray);
    if(this.sched == null)
    {
      this.addNewPeriod();
    }else
    {
      for(let period of this.sched.periods)
      {
        this.addInitialPeriods();
      }
    }
  }

  getPeriods(){
    return this.scheduleForm.get('periods');
  }

  addInitialPeriods(){
    const fa = (this.scheduleForm.get('periods')as FormArray);
    fa.push(this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      duration: ['', Validators.required]
    }));
  }

  addNewPeriod(){
    const fa = (this.scheduleForm.get('periods')as FormArray);
    fa.push(this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      duration: ['', Validators.required]
    }));
    this.sched.periods.push({startTime:{hours:0, minutes:0}, endTime:{hours:0, minutes:0}, duration:15});
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

  clearSchedule(){
    this.sched.scheduleId = null;
  }

  populateForm(){
    // patch the simple values of the form
    this.scheduleForm.patchValue(
      {
        scheduleName: this.sched.name,
        deviceId: this.sched.deviceId,
        delay: this.sched.delay,
        intensity: this.sched.intensity,
        sensorPort: this.sched.sensorPort,
        lightPort: this.sched.lightPort,
        room: {
          roomWidth: this.sched.room.roomWidth,
          roomHeight: this.sched.room.roomHeight,
        }
      }
    );

    // find the nested stuff and update its value
    var index = 0;
    for(const period in this.sched.periods)
    {
      (<FormArray>this.scheduleForm.get('periods')).at(index).get('startTime').patchValue(this.makeTime(this.sched.periods[index].startTime));
      (<FormArray>this.scheduleForm.get('periods')).at(index).get('endTime').patchValue(this.makeTime(this.sched.periods[index].endTime));
      (<FormArray>this.scheduleForm.get('periods')).at(index).get('duration').patchValue(this.sched.periods[index].duration);
      index ++;
    }
  }

  onFormSubmit() {

    var newSchedule:Schedule;
    newSchedule = new Schedule(null);

    //make the new schedule to submit based on the form values
    //this can probably be done WAY more easily if you took some time
    newSchedule.name = this.scheduleForm.value.scheduleName;
    newSchedule.deviceId = this.scheduleForm.value.deviceId;
    newSchedule.delay = this.scheduleForm.value.delay;
    newSchedule.intensity = this.scheduleForm.value.intensity;
    newSchedule.sensorPort = this.scheduleForm.value.sensorPort;
    newSchedule.lightPort = this.scheduleForm.value.lightPort;
    newSchedule.periods = [];
    
    for (let period of this.scheduleForm.value.periods)
    {
      //prep the new schedule from the form data
      var start = period.startTime.toString().split(":",2);
      var end = period.endTime.toString().split(":",2);
      var dur = period.duration;
      newSchedule.periods.push({startTime:{hours:parseInt(start[0]), minutes:parseInt(start[1])}, 
                                endTime:{hours:parseInt(end[0]), minutes:parseInt(end[1])},
                                duration: dur}
                                );
    }
    newSchedule.room = this.scheduleForm.value.room;

    // if the page doesn't have an active schedule id, then post a new schedule
    if(this.sched.scheduleId == null){
      console.log("make a new schedule");
      console.log(newSchedule);
      this.httpClient
      .post<any>(this.SERVER_URL, newSchedule)
      .subscribe(res => console.log(res), err => console.log(err));
    }
    else{
      console.log("update schedule" + this.sched.scheduleId.toString());
      //make sure to put the id in the schedule before you send it off
      newSchedule.scheduleId = this.sched.scheduleId;
      console.log(newSchedule);
      this.httpClient
      // note that you gotta put the schedule id in the url string
      .put<any>(this.SERVER_URL + this.sched.scheduleId.toString(), newSchedule)
      .subscribe(res => console.log(res), err => console.log(err));

    }
  }

  updateScheduleOnServer(){
  // this should get the update code eventually
  }
  addScheduleToServer(){
  // this should get the add code eventually
  }

  // get a particular schedule by id and use it as the current schedule
  getSchedule(id?){
    var json;
    if(id == null)id = 42;
    this.httpClient
      .get<any>(this.SERVER_URL + id.toString())
      .subscribe(res => {
        json = res;
        console.log(json);
        this.sched = json; // update the current sched AFTER the api gets back to you
        this.populateForm();
      } , err => console.log(err));
  }

  // load a schedule from the database based on the entered id
  loadNewSchedule(event: any) {
    console.log(event.target.schedId.value);
    this.getSchedule(event.target.schedId.value);
  } 

}
