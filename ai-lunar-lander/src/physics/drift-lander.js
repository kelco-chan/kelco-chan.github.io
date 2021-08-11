import Lander from "./lander.js";
import CONFIG from "../config.js";
import StageLander from "./stage-lander.js";
class DriftLander extends StageLander{
    constructor(){
        super(...arguments);
        this.stages = [
            {
                start:0*1000,
                dt:179*1000,
                throttle:7430 / CONFIG.maxMainNozzleThrust,
                angle: -0.96
            },{
                start: 179 * 1000,
                dt:342 * 1000,
                throttle: 6180 / CONFIG.maxMainNozzleThrust,//1,
                angle:0
            },
        ];
        this.name="Drifter"
    }
    render(ctx,_,offset){
        return super.render(ctx,"purple",offset,false);
    }
}
export default DriftLander;