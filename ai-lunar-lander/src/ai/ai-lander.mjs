import Lander from "../physics/lander.js";
import CONFIG from "../config.js";
/**
 * Rescales a number from 0 - 1;
 * @param number - input number
 * @param in_min - min of input range (i.e. if this number is input, this will return 0)
 * @param in_max - max of input range (i.e. if this number is input, this will return 1)
 * @returns 
 */
Math.rescale = function (number, in_min,in_max){
    if(in_max < in_min) throw new Error(`in_max should be > in_min but receive max=${in_max}, min = ${in_min}`)
    return Math.max(Math.min((number-in_min) / (in_max-in_min), 1), 0);
}
class AILander extends Lander{
    constructor(pos,target,velocity,brain,verboseInfo){
        super(...arguments);
        this.brain = brain;
        this.name="AI";
        this.verboseInfo = !!verboseInfo;//Boolean
    }
    update(ms){
        if(this.finished) return;
        this.fireNozzles(this.brain.activate(this.inputs),ms);
        super.update(...arguments);//imagine doing fisiks lol
    }
    calculateStats(){
        super.calculateStats();
        this.stats.score -=  40 * this.brain.nodes.length;
        this.brain.score = this.stats.score;
        this.brain.stats = this.stats;
        return this.stats;
    }
    get inputs(){
        //returns the state of the lander
        return [
            Math.rescale(this.v.x,-CONFIG.maxComponentSpeed,CONFIG.maxComponentSpeed),//vx
            Math.rescale(this.v.y,-CONFIG.maxComponentSpeed,CONFIG.maxComponentSpeed),//vy
            Math.rescale(this.pos.x-this.target.x, -600, 600),//x
            Math.rescale(this.pos.y-this.target.y, 0, 1000),//y
            Math.rescale(this.a, -Math.PI, Math.PI),
            Math.rescale(this.av, -Math.PI, Math.PI),
            this.mass/CONFIG.landerWetMass
        ]
    }
    render(ctx,_,offset){
        super.render(ctx,"rgba(255,0,0,0.1)",offset,this.verboseInfo)
    }
}
export default AILander;