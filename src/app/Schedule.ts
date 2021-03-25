import { ThisReceiver } from "@angular/compiler";
import {Room} from "./Room";
import {SchedulePeriod} from "./SchedulePeriod";
export class Schedule{
    
    scheduleId?:number;
    deviceId:number;
    name: String;
    periods: SchedulePeriod[];
    room: Room;
    delay:number;
    intensity:number;
    sensorPort:number;
    lightPort:number;

    constructor(json: Schedule)
    {
            if(json != null)
            {
                var obj = json;
                this.deviceId = obj.deviceId;
                this.name = obj.name;
                this.room = obj.room;
                this.periods = obj.periods;
                this.delay = obj.delay;
                this.intensity = obj.intensity;
                this.sensorPort = obj.sensorPort;
                this.lightPort = obj.lightPort;
            }
    }

}