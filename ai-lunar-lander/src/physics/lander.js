"use strict";
import Vector from "./vector.js";
import CONFIG from "../config.js";
const landerPixelHeight = CONFIG.scale*CONFIG.landerHeight
class Lander{
    /**
     * 
     * @param {Vector} pos - position vector
     */
    constructor(pos,target,velocity){
        this.pos = pos;
        this.v = velocity || new Vector(0,0);
        this.usedFuel = 0;
        this.finished = false;
        this.msRemaining = CONFIG.maxFlightTime;
        this.target = target;
        this.stats = {
            penalty:0
        }
    }
    fireNozzle(index,throttle,ms){
        if(!throttle || throttle<0.1 || throttle>1) return false;//too little throttle, no firing occured
        let finalThrust;
        if(index===0 || index===1){// 1 fires left engine, 0 fires right engine
            finalThrust = throttle*CONFIG.maxSideNozzleThrust*ms/1000;
            this.v.add(new Vector( (index === 1 ? 1 : -1) * finalThrust,0));
        }else if(index===2){//bottom
            finalThrust = throttle*CONFIG.maxMainNozzleThrust*ms/1000;
            this.v.add(new Vector(0,-finalThrust));
        }else{
            throw new Error(`Unknown nozzle "${index}"`);        
        }
        this.usedFuel+=finalThrust;
        return true;//nozzle actually fired
    }
    fireNozzles(throttles,ms){
        this.fireNozzle(0,throttles[0],ms);
        this.fireNozzle(1,throttles[1],ms);
        this.fireNozzle(2,throttles[2],ms);
    }
    update(ms){
        if(this.finished) return;
        if(ms>2000){
            return;//person left the sim and came back, skip this loop and come back later
        }
        this.msRemaining -= ms;
        this.v.add(new Vector(0,CONFIG.grav).scale(ms/1000,true))//gravity exists btw;

        this.v.x = Math.min(Math.max(-CONFIG.maxComponentSpeed,this.v.x),CONFIG.maxComponentSpeed);
        this.v.y = Math.min(Math.max(-CONFIG.maxComponentSpeed,this.v.y),CONFIG.maxComponentSpeed);
        //debugger;
        this.pos.add(this.v.scale(ms/1000,true));

        //update velocity
        if((this.pos.y> this.target.y - CONFIG.landerHeight/2 + 0.3) || (this.msRemaining<=0)){
            this.finished = true;
            this.calculateStats();
        }
    }
    calculateStats(){
        this.stats = {
            xoffset: Math.abs(this.target.x-this.pos.x),
            yoffset: Math.abs(this.target.y-this.pos.y),
            fuel:this.usedFuel,
            v:this.v.magnitude,
            speed:this.v.magnitude,
            penalty:this.stats.penalty
        }
        this.stats.score = 0;
        this.stats.score -= this.stats.penalty;
        this.stats.score -= 0.2*this.stats.fuel;
        this.stats.score -= 160 * Math.abs(this.stats.v);
        if(this.stats.yoffset > 10){
            this.stats.score -= 10*1000;
            this.stats.score -= 100*Math.abs(this.stats.yoffset);
        }
        if(this.stats.xoffset > 20){
            this.stats.score -= 80*this.stats.xoffset;
        }
        return this.stats;
    }
    /**
     * Renders a lander
     * @param {*} ctx 
     * @param {String} color - ctx color
     * @param {Boolean} verboseInfo - whether or not to show velocity info
     * @param {Vector} offset - offset to render lander by
     */
    render(ctx,color="rgba(255,0,0,0.1)",offset,verboseInfo){
        //lander is 3px by 3px
        ctx.fillStyle=color;
        //scale the position of the lander by CONFIG.scale
        let renderPos = this.pos.scale(CONFIG.scale,true).shift(-landerPixelHeight/2,-landerPixelHeight/2).add(offset);
        ctx.fillRect(renderPos.x,renderPos.y,landerPixelHeight,landerPixelHeight);
        if(verboseInfo){
            ctx.fillStyle = "black";
            ctx.fillText(`V: ${this.v.x.toFixed(1)}, ${this.v.y.toFixed(1)}\nHorizontal displacement: ${(this.target.x-this.pos.x).toFixed(1)}, ${(this.target.y-this.pos.y).toFixed(1)}`,this.pos.x,this.pos.y-10);
        }
        return renderPos;
    }
}
export default Lander;
