import { ThisReceiver } from "@angular/compiler";
import {Room} from "./Room";
import {SchedulePeriod} from "./SchedulePeriod";
export class Schedule{
    
    scheduleId?:number
    name: String;
    periods: SchedulePeriod[];
    room: Room;

    constructor(json: Schedule)
    {
            if(json != null)
            {
                var obj = json;
                this.name = obj.name;
                this.room = obj.room;
                this.periods = obj.periods;
            }
    }

}