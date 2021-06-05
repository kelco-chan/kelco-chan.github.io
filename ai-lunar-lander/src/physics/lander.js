"use strict";
import Vector from "./vector.js";
import CONFIG from "../config.js";
/**Needs vector.js and config to work */
class Lander{
    /**
     * 
     * @param {Vector} pos - position vector
     */
    constructor(pos,target){
        this.pos = pos;
        this.v = new Vector(0,0);
        this.usedFuel = 0;
        this.finished = false;
        this.msRemaining = CONFIG.maxFlightTime;
        this.target = target;
        this.stats = {
            penalty:0
        }
    }
    fireNozzle(index,throttle){
        if(!throttle || throttle<0.25 || throttle>1) return false;//too, no firing occured
        let finalThrust = CONFIG.minNozzleThrust+throttle*(CONFIG.maxNozzleThrust-CONFIG.minNozzleThrust);//add minimum and mximum thrust
        this.usedFuel+=finalThrust;
        if(index===0){//left
            this.v.add(new Vector(-finalThrust,0));
        }else if(index===1){//right
            this.v.add(new Vector(finalThrust,0));
        }else if(index===2){//bottom
            this.v.add(new Vector(0,-finalThrust));
        }else{
            throw new Error(`Unknown nozzle "${index}"`);        
        }
        return true;//nozzle actually fired
    }
    fireNozzles(throttles){
        this.fireNozzle(0,throttles[0]);
        this.fireNozzle(1,throttles[1]);
        this.fireNozzle(2,throttles[2]);
    }
    update(ms){
        if(this.finished) return;
        if(ms>2000){
            return;//person left the sim and came back, skip thsi loop and come backlater
        }
        this.msRemaining -= ms;
        this.v.add(new Vector(0,CONFIG.grav).scale(ms/1000,true))//gravity exists btw;
        this.v.x = Math.min(Math.max(-CONFIG.maxComponentSpeed,this.v.x),CONFIG.maxComponentSpeed);
        this.v.y = Math.min(Math.max(-CONFIG.maxComponentSpeed,this.v.y),CONFIG.maxComponentSpeed);
        //debugger;
        this.pos.add(this.v.scale(ms/1000,true));
        //penalty of floating away horizontally
        if((this.pos.x>CONFIG.width) || (this.pos.x<0)){
            this.stats.penalty+=1000000;
        }
        //penalty fo y position
        if(this.pos.y<0){
            this.stats.penalty+=1000000;
        }
        //update velocity
        if((this.pos.y>this.target.y-10) || (this.msRemaining<=0) || (this.pos.y<-10) || (this.pos.x<-10) || (this.pos.x>CONFIG.width+10)){
            this.finished = true;
            this.calculateStats();
        }
    }
    calculateStats(){
        this.stats = {
            xoffset: Math.abs(this.target.x-this.pos.x),
            yoffset: Math.abs(this.target.y-this.pos.y),
            fuel:this.usedFuel,
            vy:this.v.y,
            vx:this.v.x,
            speed:this.v.magnitude,
            penalty:this.stats.penalty
        }
        this.stats.score = 0;
        this.stats.score -= this.stats.penalty;
        this.stats.score -= 0.2*this.stats.fuel;
        if(this.stats.yoffset<10){
            this.stats.score -= 80 * Math.abs(this.stats.vy);
            this.stats.score -= 60 * Math.abs(this.stats.vx);
            this.stats.score -= 70*this.stats.xoffset;
        }else{
            this.stats.score -= 100000000;
            this.stats.score -= 100*Math.abs(this.stats.yoffset);
        }
        return this.stats;
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx - ctx for canvas 
     */
    render(ctx,color="rgba(255,0,0,0.1)",verboseInfo){
        //lander is a pos of 20 by 20
        ctx.fillStyle=color;
        ctx.fillRect(this.pos.x-10,this.pos.y-10,20,20);
        if(verboseInfo){
            ctx.fillStyle = "black";
            ctx.fillText(`V: ${this.v.x.toFixed(1)}, ${this.v.y.toFixed(1)}\nHorizontal displacement: ${(this.target.x-this.pos.x).toFixed(1)}, ${(this.target.y-this.pos.y).toFixed(1)}`,this.pos.x,this.pos.y-10);
        }
    }
}
export default Lander;
