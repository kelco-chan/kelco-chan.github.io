import Lander from "./lander.js";
import CONFIG from "../config.js";
class StageLander extends Lander{
    constructor(){
        super(...arguments);
        this.stages = [];
        this.name = "Staged"
        this.currentStageNumber = -1;
        this.currentStage = null;
    }
    update(ms){
        if(this.currentStage){
            let end = this.currentStage.start+this.currentStage.dt;
            if(end<this.msElapsed){
                telementry.log(this.name,"Stage " + this.currentStageNumber + " finish")
                this.currentStage = null;
            }else{
                this.a = this.currentStage.angle;
                this.fireNozzle(2,this.currentStage.throttle,ms);
            }
        }
        if(!this.currentStage){
            let upcoming = this.stages[this.currentStageNumber+1];
            
            if( upcoming && (upcoming.start < this.msElapsed)){
                //ooi start the time;
                this.currentStageNumber += 1;
                this.currentStage = this.stages[this.currentStageNumber]
                telementry.log(this.name,"Stage " + this.currentStageNumber + " commence")
            }
        }
        super.update(...arguments);
    }
    calculateStats(){
        telementry.log(this.name,"engine shutdown")
        return super.calculateStats(...arguments);
    }
}
export default StageLander;