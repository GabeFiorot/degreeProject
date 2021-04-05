import { HttpClient } from '@angular/common/http';
import { ScheduleService } from './../schedule.service';
import { Schedule } from './../Schedule';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormArray, Form} from '@angular/forms';
import { SchedulePeriod } from '../SchedulePeriod';
import { Room } from '../Room';
import { Device } from '../Device';
import { Time } from '@angular/common';
import { splitAtColon } from '@angular/compiler/src/util';
import { LightConfig } from '../LightConfig';
//import { Console } from 'node:console';



@Component({
  selector: 'app-schedule-builder',
  templateUrl: './schedule-builder.component.html',
  styleUrls: ['./schedule-builder.component.css'],
  
})

export class ScheduleBuilderComponent implements OnInit
{
  SERVER_URL: string = 'https://luxo-api-test.azurewebsites.net/api/Schedules/';
  scheduleForm:FormGroup;
  deviceForm:FormGroup;
  list:number[] = [1,2,3,4,5];
  sched: Schedule;
  device : Device;
  currentSchedule:number;
  constructor(private httpClient: HttpClient, private fb:FormBuilder) {}

  ngOnInit()
  {
    //this.sched = new Schedule(null);
    //this.sched.periods = [];
    //this.sched.lightConfigs = [];
    this.device = JSON.parse("{\"DeviceId\":0,\"Name\":\"liveapidevice\",\"room\":{\"roomWidth\":12,\"roomHeight\":10},\"schedules\":[{\"name\":\"testsched\",\"delay\":100,\"intensity\":255,\"lightConfigs\":[{\"lightPort\":1,\"sensorPorts\":[{\"port\":3},{\"port\":4}]},{\"lightPort\":2,\"sensorPorts\":[{\"port\":5},{\"port\":6}]}],\"periods\":[{\"startTime\":{\"hours\":8,\"minutes\":22},\"endTime\":{\"hours\":9,\"minutes\":35},\"duration\":0},{\"startTime\":{\"hours\":13,\"minutes\":45},\"endTime\":{\"hours\":15,\"minutes\":21},\"duration\":0}]}]}");
    this.currentSchedule = 0;
    this.sched = this.device.schedules[this.currentSchedule];
    
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
      delay: [''],
      intensity: [''],
      periods: this.fb.array([]),
      lightConfigs: this.fb.array([])
    });

    this.deviceForm = this.fb.group({
      deviceName: ['', Validators.required],
      schedules: this.fb.array([]),
      room: this.fb.group({
          roomWidth: [''],
          roomHeight: ['']
        }),
    })
    const fa = (this.scheduleForm.get('periods')as FormArray);
    if(this.sched == null)
    {
      this.addNewPeriod();
      this.addNewLightConfig();
    }else
    {
      for(let period of this.sched.periods)
      {
        this.addInitialPeriods();
      }
      for(let config of this.sched.lightConfigs)
      {
        var index = this.sched.lightConfigs.indexOf(config)
        this.addInitialLightConfigs();
        for(let port of config.sensorPorts)
        {
          this.addInitialSensorPorts(index);
        }
      }

      for(let schedule of this.device.schedules)
      {
        this.addInitialSchedules();
      }
    }

    this.populateForm(this.sched);
    this.populateDeviceForm();
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

  getLightConfigs(){
    return this.scheduleForm.get('lightConfigs');
  }

  addInitialLightConfigs(){
    const fa = (this.scheduleForm.get('lightConfigs')as FormArray);
    fa.push(this.fb.group({
      lightPort: ['', Validators.required],
      sensorPorts: this.fb.array([]),
    }));
  }

  addNewLightConfig(){
    const fa = (this.scheduleForm.get('lightConfigs')as FormArray);
    fa.push(this.fb.group({
      lightPort: ['', Validators.required],
      sensorPorts: this.fb.array([]),
    }));
    this.sched.lightConfigs.push({lightPort:0, sensorPorts:[{port:0},{port:0}]});
  }

  deleteLightConfig(i:number){
    const fa = (this.scheduleForm.get('lightConfigs')as FormArray);
    fa.removeAt(i);
    if(fa.length===0) this.addNewLightConfig();
  }

  getSensorPorts(){
    return this.scheduleForm.get('lightConfigs').get('sensorPorts');
  }

  addInitialSensorPorts(i:number){
    const fa = (this.scheduleForm.get('lightConfigs')['controls'][i].get('sensorPorts')as FormArray);
    fa.push(this.fb.group({
      port: ['', Validators.required],
    }));
  }

  addNewSensorPorts(i:number){
    const fa = (this.scheduleForm.get('lightConfigs')['controls'][i].get('sensorPorts')as FormArray);

    fa.push(this.fb.group({
      port: ['', Validators.required],
    }));
    this.sched.lightConfigs[i].sensorPorts.push({port:0});
  }

  deleteSensorPort(i:number, j:number){
    const fa = (<FormArray>this.scheduleForm.get('lightConfigs')).at(i).get('sensorPorts')as FormArray;
    fa.removeAt(j);
    if(fa.length===0) this.addNewSensorPorts(i);
  }

  getSchedules(){
    return this.deviceForm.get('schedules');
  }

  addInitialSchedules(){
    const fa = (this.deviceForm.get('schedules')as FormArray);
    fa.push(this.fb.group({
      name: ['', Validators.required],
    }));
  }

  addNewSchedules(){
    const fa = (this.deviceForm.get('schedules')as FormArray);

    fa.push(this.fb.group({
      name: ['', Validators.required],
    }));
    this.device.schedules.push({
      name:'new schedule',
      periods: [],
      delay:0,
      intensity:0,
      lightConfigs:[]
    });
  }

  deleteSchedules(i:number){
    const fa = (<FormArray>this.deviceForm.get('schedules'))as FormArray;
    fa.removeAt(i);
    //this.device.schedules.pop();
    //if(fa.length===0) this.addNewSchedules();
      this.device.schedules.splice(i, 1);

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
    
    return (hoursAdj + ":" + minutesAdj);
  }

  clearSchedule(){
    this.sched.scheduleId = null;
  }

  populateDeviceForm(){
    console.log(this.device);
    this.deviceForm.patchValue({
      deviceName : this.device.Name,
      room : 
      {
        roomWidth : this.device.room.roomWidth,
        roomHeight : this.device.room.roomHeight
      }
    });

    var index = 0;
    for (const schedule in this.device.schedules)
    {
      (<FormArray>this.deviceForm.get('schedules')).at(index).get('name').patchValue(this.device.schedules[index].name);
      index++;
    }
  }

  populateForm(sched:Schedule){
    // patch the simple values of the form
    this.scheduleForm.patchValue(
      {
        scheduleName: sched.name,
        delay: sched.delay,
        intensity: sched.intensity
      }
    );

    // find the nested stuff and update its value
    var index = 0;
    for(const period in sched.periods)
    {
      (<FormArray>this.scheduleForm.get('periods')).at(index).get('startTime').patchValue(this.makeTime(sched.periods[index].startTime));
      (<FormArray>this.scheduleForm.get('periods')).at(index).get('endTime').patchValue(this.makeTime(sched.periods[index].endTime));
      (<FormArray>this.scheduleForm.get('periods')).at(index).get('duration').patchValue(sched.periods[index].duration);
      index ++;
    }

    var index = 0;
    for(const config in sched.lightConfigs)
    {
      (<FormArray>this.scheduleForm.get('lightConfigs')).at(index).get('lightPort').patchValue(sched.lightConfigs[index].lightPort);
      var j = 0;
      for(const port in sched.lightConfigs[index].sensorPorts)
      {
        var curConfig = (<FormArray>this.scheduleForm.get('lightConfigs')).at(index);
        var sensors = curConfig.get('sensorPorts');
        var target = (<FormArray>sensors).at(j);
        //target.patchValue(5);
        var newValue = sched.lightConfigs[index].sensorPorts[j].port;
        (<FormArray>(<FormArray>this.scheduleForm.get('lightConfigs')).at(index).get('sensorPorts')).at(j).get('port').patchValue(newValue);
        j++;
      }
      //(<FormArray>this.scheduleForm.get('lightConfigs')).at(index).get('endTime').patchValue(this.makeTime(this.sched.periods[index].endTime));
      //(<FormArray>this.scheduleForm.get('lightConfigs')).at(index).get('duration').patchValue(this.sched.periods[index].duration);
      index ++;
    }
  }

  onFormSubmit() {

    var newSchedule:Schedule;
    newSchedule = new Schedule(null);

    //make the new schedule to submit based on the form values
    //this can probably be done WAY more easily if you took some time
    newSchedule.name = this.scheduleForm.value.scheduleName;
    //newSchedule.deviceId = this.scheduleForm.value.deviceId;
    newSchedule.delay = this.scheduleForm.value.delay;
    newSchedule.intensity = this.scheduleForm.value.intensity;
    //newSchedule.sensorPort = this.scheduleForm.value.sensorPort;
    //newSchedule.lightPort = this.scheduleForm.value.lightPort;
    newSchedule.periods = [];
    newSchedule.lightConfigs = [];
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
    //newSchedule.room = this.scheduleForm.value.room;
    for(let config of this.scheduleForm.value.lightConfigs)
    {
      var newConfig:LightConfig;
      newConfig = new LightConfig();
      newConfig.sensorPorts = [];
      for(let sensor of config.sensorPorts)
      {
        newConfig.sensorPorts.push({port: sensor.port})
      }

      newSchedule.lightConfigs.push(newConfig)
    }

    this.device.schedules[this.currentSchedule] = newSchedule;
    this.populateDeviceForm();
    /*
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
    */
  }

  updateScheduleOnServer(){
  // this should get the update code eventually
  }
  addScheduleToServer(){
  // this should get the add code eventually
  }


  editSchedule(index:number)
  {
    this.currentSchedule = index;
    this.populateForm(this.device.schedules[this.currentSchedule]);
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
        this.populateForm(json);
      } , err => console.log(err));
  }

  // load a schedule from the database based on the entered id
  loadNewSchedule(event: any) {
    console.log(event.target.schedId.value);
    this.getSchedule(event.target.schedId.value);
  } 

}