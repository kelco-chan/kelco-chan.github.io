import Lander from "../physics/lander.js";
import CONFIG from "../config.js";
class AILander extends Lander{
    constructor(pos,target,velocity,brain,verboseInfo){
        super(...arguments);
        this.brain = brain;
        this.verboseInfo = !!verboseInfo;//Boolean
    }
    update(ms){
        if(this.finished) return;
        this.fireNozzles(this.brain.activate(this.inputs),ms);
        super.update(...arguments);//imagine doing fisiks lol
        if(this.stats){
            //stats were calculated, give it to the brain
            this.brain.score=this.stats.score;
            this.brain.fuel = this.stats.usedFuel;
        }
        //console.log(`Updated pos to ${this.pos.x}, ${this.pos.y}`)
    }
    calculateStats(){
        super.calculateStats();
        this.stats.score -=  40*this.brain.nodes.length;
        return this.stats;
    }
    get inputs(){
        //returns the state of the lander
        return [
            this.v.x/(2*CONFIG.maxComponentSpeed)+0.5,
            this.v.y/(2*CONFIG.maxComponentSpeed)+0.5,
            Math.max(Math.min(600,this.pos.x-this.target.x),-600)/1200 + 0.5,
            Math.min(this.pos.y-this.target.y,1000)/1000,
            //this.usedFuel/CONFIG.maxFuel
        ]
    }
    render(ctx,_,offset){
        super.render(ctx,"rgba(255,0,0,0.1)",offset,this.verboseInfo)
    }
}
export default AILander;