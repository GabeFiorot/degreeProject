import { ThisReceiver } from "@angular/compiler";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import {Room} from "./Room";
import {SchedulePeriod} from "./SchedulePeriod";
import {LightConfig} from "./LightConfig";
export class Schedule{
    
    scheduleId?:number;
    name: String;

    periods: SchedulePeriod[];

    delay:number;
    intensity:number;

    lightConfigs:LightConfig[];

    constructor(json: Schedule)
    {
            if(json != null)
            {
                var obj = json;
                this.name = obj.name;
                this.periods = obj.periods;
                this.delay = obj.delay;
                this.intensity = obj.intensity;
                this.lightConfigs = obj.lightConfigs;
            }
    }

}