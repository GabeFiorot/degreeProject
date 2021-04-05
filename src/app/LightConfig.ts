import { ThisReceiver } from "@angular/compiler";
import {Room} from "./Room";
import {Schedule} from "./Schedule";
import {SchedulePeriod} from "./SchedulePeriod";
import {SensorPort} from "./SensorPort";
export class LightConfig{
    
    LightConfigId?:number;
    lightPort:number;
    sensorPorts:SensorPort[];

}