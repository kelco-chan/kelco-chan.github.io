import Lander from "./lander.js";
import CONFIG from "../config.js";
import StageLander from "./stage-lander.js";
class RetrogradeLander extends StageLander{
    constructor(){
        super(...arguments);
        this.stages = [
            {
                start:18600 - 16,//one frame for good luck
                dt:31800,
                throttle:1,
                angle:-0.865
            }
        ]
        this.name = "Suicide Burn";
    }
    get KE(){
        return this.mass * Math.pow(this.v.magnitude,2)/2;
    }
    get PE(){
        return this.mass * CONFIG.grav * (CONFIG.initialConditions.targetDisplacement.y-this.pos.y);
    }
    render(ctx,_,offset){
        return super.render(ctx,"blue",offset,false);
    }
}
export default RetrogradeLander;