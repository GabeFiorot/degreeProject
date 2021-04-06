import { ThisReceiver } from "@angular/compiler";
import {Room} from "./Room";
import {Schedule} from "./Schedule";
import {SchedulePeriod} from "./SchedulePeriod";
export class Device{
    
    deviceId?:number;
    name: String;
    DeviceGuid?: String;
    Owner?:number;
    schedules: Schedule[];
    room: Room;
    xpos: number;
    ypos:number;
    constructor(json: Device)
    {
            if(json != null)
            {
                var obj = json;
                this.deviceId = obj.deviceId;
                this.name = obj.name;
                this.room = obj.room;
            }
    }

}