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
    return Math.max(Math.min((Math.atomify(number, in_min, in_max) - in_min) / (in_max-in_min), 1), 0);
}
Math.roundTo = function(number, precision){
    return Math.round(number * precision) / precision;
}
/**
 * Makes sure all the the values are in boundaries.
 * @param number 
 * @param atom_min 
 * @param atom_max 
 * @returns {Number}
 */
Math.atomify = function (number, atom_min, atom_max){
    return Math.max(atom_min, Math.min(atom_max, number));
}

let hide = false;
document.addEventListener("keydown",(e)=>{
    if(e.key === "h"){
        hide = !hide;
    }
});
class AILander extends Lander{
    constructor(pos,target,velocity,brain,verboseInfo){
        super(...arguments);
        this.brain = brain;
        this.name = "AI";
        this.verboseInfo = !!verboseInfo;//Boolean

    }
    update(ms){
        if(this.finished) return;
        /**@type Number[] */
        let res = this.brain.activate(this.inputs)
        let throttle = Math.max(...res);
        let index = res.indexOf(throttle);
        if(index !== 3){
            this.fireNozzle(index, throttle, ms);
        }
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
            Math.roundTo(this.v.x, 50),//vx
            Math.roundTo(this.v.y, 50),//vy
            Math.roundTo(this.pos.x - this.target.x, CONFIG.initialConditions.targetDisplacement.x / 15),//x
            Math.roundTo(this.target.y - this.pos.y, CONFIG.initialConditions.targetDisplacement.y / 20),//y
            Math.roundTo(this.a, 10/180*Math.PI)//angle
            //Math.rescale(this.av, -Math.PI, Math.PI)
        ]
    }
    render(ctx,_,offset){
        if(!hide){
            super.render(ctx,"rgba(255,0,0,0.1)",offset,this.verboseInfo)
        }
    }
}
export default AILander;