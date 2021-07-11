import Lander from "./lander.js";
import CONFIG from "../config.js";
import StageLander from "./stage-lander.js";
class DriftLander extends StageLander{
    constructor(){
        super(...arguments);
        this.stages = [
            {
                start:0*1000,
                dt:27.3*1000,
                throttle:0.277,
                angle:0
            },{
                start:27.3*1000,
                dt:3.12*1000,
                throttle:1,
                angle:-1.3
            },{
                start:30.4*1000,
                dt:1.15*1000,
                throttle: 1,
                angle:0
            }
        ];
        this.name="Drifter"
    }
    render(ctx,_,offset){
        return super.render(ctx,"purple",offset,false);
    }
}
export default DriftLander;