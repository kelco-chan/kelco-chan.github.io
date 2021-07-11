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
        this.a = CONFIG.initialConditions.angularDisplacement;//angle from normal, clockwise, rad
        this.av = 0;//angular velocity in rad s^-1
        this.mass = CONFIG.landerWetMass;
        this.finished = false;
        this.hidden = false;
        this.msElapsed = 0;
        this.target = target;
        this.stats = {};
        this.acc = new Vector(0,CONFIG.grav);
        
    }
    fireNozzle(index,throttle,ms){
        if(!throttle || throttle<0.1 || throttle>1) return false;//too little throttle, no firing occured
        if(index===0 || index===1){// 1 fires left engine, 0 fires right engine
            this.av += (index === 1 ? 1 : -1) * CONFIG.maxAngularAcceleration * ms / 1000;
        }else if(index===2){//bottom
            //decrease self mass
            if(this.mass < CONFIG.landerWetMass - CONFIG.maxFuel){
                //o_0 fuel Ran out
                return;
            }
            //deduct mass
            this.mass -= CONFIG.maxFuelMassRate * throttle * ms / 1000;
            //add thrust
            let acc = throttle * CONFIG.maxMainNozzleThrust/this.mass;
            this.acc.shift(acc * Math.sin(this.a),-acc * Math.cos(this.a));
            //this.v.add(  );
        }else{
            throw new Error(`Unknown nozzle "${index}"`);        
        }
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
        this.msElapsed += ms;
        /*ANGULAR VELOCITY*/
        this.a += this.av * ms / 1000;
        /*LINEAR VELOCITY*/
        let t = ms/1000;//delta t in seconds
        //add gravity onto the acceleration
        //change s
        this.pos.add(this.v.scale(t,true))//ut
                .add(this.acc.scale(t*t/2,true))//1/2 at^2
        //change v
        this.v.add(this.acc.scale(t,true))//v = u+at

        //cap v
        this.v.x = Math.min(Math.max(-CONFIG.maxComponentSpeed,this.v.x),CONFIG.maxComponentSpeed);
        this.v.y = Math.min(Math.max(-CONFIG.maxComponentSpeed,this.v.y),CONFIG.maxComponentSpeed);

        //clear regesitered acceleration
        this.acc.set(0,CONFIG.grav);

        //check if out of bounds
        if((this.pos.y < -10) || (this.pos.x < -10) || (this.pos.x > CONFIG.width + 10)){
            this.finished = true;
            this.hidden = true;//hidden since out of bounds
        }
        //normal finished
        if((this.pos.y > this.target.y - CONFIG.landerHeight/2 + 0.3) || (this.msElapsed >= CONFIG.maxFlightTime)){
            this.finished = true;
        }
        if(this.finished){
            this.calculateStats();
        }
    }
    calculateStats(){
        //add rotation to scoring system
        this.stats = {
            xoffset: Math.abs(this.target.x-this.pos.x),
            yoffset: Math.abs(this.target.y-this.pos.y),
            v:this.v.magnitude,
            fuel: CONFIG.landerWetMass - this.mass,
            angle:this.a
        }
        this.stats.score = 0;
        this.stats.score -= 0.5 * this.stats.fuel;
        if(Math.abs(this.stats.v) > 1){
            this.stats.score -= 200 * Math.abs(this.stats.v);
        }
        if(this.stats.yoffset > 10){
            this.stats.score -= 100 * Math.abs(this.stats.yoffset);
        }
        //angle
        if(Math.abs(this.stats.a) > 12 / 180 * Math.PI){
            //too tilted
            this.stats.score -= 5000;
        }
        this.stats.score -= 90 * this.stats.xoffset;
        return this.stats;
    }
    /**
     * Renders a lander
     * @param {*} ctx 
     * @param {String} color - ctx color
     * @param {Boolean} verboseInfo - whether or not to show velocity info
     * @param {Vector} offset - offset to render lander by
     */
    render(ctx,color="rgba(255,0,0,0.1) q",offset,verboseInfo){
        if(this.hidden) return;
        //lander is 3px by 3px
        ctx.fillStyle = color;
        //scale the position of the lander by CONFIG.scale
        let landerRenderCenter = this.pos.scale(CONFIG.scale,true).add(offset);
        let landerRenderTopLeft = landerRenderCenter.shift(-landerPixelHeight/2,-landerPixelHeight/2,true);
        
        ctx.save();
        ctx.translate(landerRenderCenter.x,landerRenderCenter.y);
        ctx.rotate(this.a);
        ctx.translate(-landerRenderCenter.x,-landerRenderCenter.y);
        
        ctx.fillRect(landerRenderTopLeft.x, landerRenderTopLeft.y, landerPixelHeight, landerPixelHeight * 0.66);
        ctx.beginPath();
        ctx.moveTo(landerRenderCenter.x, landerRenderCenter.y + landerPixelHeight / 6);
        ctx.lineTo(landerRenderTopLeft.x, landerRenderTopLeft.y + landerPixelHeight);
        ctx.lineTo(landerRenderTopLeft.x + landerPixelHeight, landerRenderTopLeft.y + landerPixelHeight);
        ctx.fill();
        ctx.restore();

        return landerRenderTopLeft;
    }
}
export default Lander;
