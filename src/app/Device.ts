import { ThisReceiver } from "@angular/compiler";
import {Room} from "./Room";
import {Schedule} from "./Schedule";
import {SchedulePeriod} from "./SchedulePeriod";
export class Device{
    
    deviceId?:number;
    Name: String;
    schedules: Schedule[];
    room: Room;

    constructor(json: Device)
    {
            if(json != null)
            {
                var obj = json;
                this.deviceId = obj.deviceId;
                this.Name = obj.Name;
                this.room = obj.room;
            }
    }

}