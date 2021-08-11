import Lander from "./lander.js";
import CONFIG from "../config.js";
function minimiseAngle(a){
    return [a+Math.PI*2,a,a-Math.PI*2].sort((a,b)=>Math.abs(a)-Math.abs(b))[0];
}
class StageLander extends Lander{
    constructor(){
        super(...arguments);
        this.stages = [];
        this.name = "Staged"
        this.currentStageNumber = -1;
        this.currentStage = null;
        this.targetAngle = null;
        this.msElapsed = 0;
    }
    update(ms){
        this.msElapsed += ms;
        if(this.currentStage){
            let end = this.currentStage.start+this.currentStage.dt;
            if(end<this.msElapsed){
                telementry.log(this.name,"Stage " + this.currentStageNumber + " finish")
                this.currentStage = null;
            }else{
                this.runAngleManuver(ms);
                //fire nozzle
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
        telementry.log(this.name,"Ground contact acheived")
        return super.calculateStats(...arguments);
    }
    runAngleManuver(ms){
        this.a = this.currentStage?this.currentStage.angle:0;
        /*let nextStage = this.stages[this.currentStageNumber+1];
        let deltaa = minimiseAngle(this.currentStage.angle - this.a);
        if(nextStage){
            let timeForNextStage = nextStage && Math.abs(minimiseAngle(nextStage.angle - this.currentStage.angle) / 0.2);
            let middleTime = this.currentStage?(this.currentStage.start+this.currentStage.dt + nextStage.start)/2:(this.msElapsed + timeForNextStage/2.1);
            if(this.msElapsed > (middleTime - timeForNextStage/2)){
                deltaa = minimiseAngle(nextStage.angle - this.a);
            }
        }
        if(deltaa > 0.05){
            if(this.av < 0.2){ 
                this.fireNozzle(1,1,ms);
            }
        }else if(deltaa < -0.05){
            if(this.av > -0.2){
                this.fireNozzle(0,1,ms);
            }
        }*/
    }
}
export default StageLander;