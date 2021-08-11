import CONFIG from "../config.js";
import Vector from "./vector.js";

let currentTrackingIndex = -1;
let forceNextSkip = false;
document.addEventListener("keyup",function(e){
    if(e.key === "["){
        currentTrackingIndex -= 1;
    }else if (e.key === "]"){
        currentTrackingIndex += 1;
    }else if(e.key === "j"){
        forceNextSkip = true;
    }
})
function runLanders(landers,target,ctx){
    return new Promise(function(res){
        let cameraOffset = new Vector(0,0);//new Vector(0,ctx.canvas.height - apparentTarget.y - CONFIG.landerHeight*CONFIG.scale/2);//offset in px;
        let msElapsed = 0;
        function loop(){
            const ms = 15;
            if((0 <= msElapsed%5_000) && (msElapsed%5_000 < 15)){
                telementry.log("Simulation", msElapsed + "ms elapsed")
            }
            msElapsed += ms;
            for(let lander of landers){
                lander.update(ms);
            }
            if(forceNextSkip || (msElapsed > CONFIG.maxFlightTime) || landers.every(l=>l.finished)){
                forceNextSkip = false;
                landers.forEach(l => l.finish());
                res();
                return;
            }
            ctx.fillStyle = CONFIG.simulationBackgroundColor;
            ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
            let trackingLander = landers[(currentTrackingIndex+landers.length)%landers.length];
            //default tracking
            cameraOffset = trackingLander.pos.scale(-CONFIG.scale,true).shift(CONFIG.width/2,CONFIG.height/2);
            if((target.y - trackingLander.pos.y) * CONFIG.scale < CONFIG.height/2){
                cameraOffset.y = (-target.y * CONFIG.scale) + CONFIG.height;
            }
            let gridLength = 100 * CONFIG.scale;
            let mod1 = cameraOffset.x % gridLength;
            let distance1 = (-cameraOffset.x + mod1) / CONFIG.scale - CONFIG.initialConditions.targetDisplacement.x;
            let mod2 = cameraOffset.y % gridLength;
            let distance2 = (-cameraOffset.y + mod2) / CONFIG.scale - CONFIG.initialConditions.targetDisplacement.y;
            ctx.strokeStyle = ctx.fillStyle = "#0000003d";
            ctx.lineWidth = 1;
            for(let i = -1; i < 18; i++){
                ctx.beginPath();
                ctx.moveTo(mod1+i*gridLength, 0);
                ctx.lineTo(mod1+i*gridLength, CONFIG.height);
                ctx.stroke();
                ctx.fillText(distance1 + i*100 + "m", mod1 + i * gridLength, CONFIG.height);
            }
            for(let i = -1; i < 10; i++){
                ctx.beginPath();
                ctx.moveTo(0, mod2 + i*gridLength);
                ctx.lineTo(CONFIG.width, mod2 + i*gridLength);
                ctx.stroke();
                ctx.fillText(distance2 + i * 100 + "m", 0, mod2 + i * gridLength);
            }

            let apparentTarget = target.scale(CONFIG.scale,true).add(cameraOffset);//location of target in pixels
            let baselineY =  apparentTarget.y;

            for(var lander of landers){
                lander.render(ctx,undefined,cameraOffset,false);
            }
            ctx.lineWidth = 2;
            ctx.strokeStyle="black";
            ctx.fillStyle="black";
            //render target
            //draw flag pole
            ctx.beginPath();
            ctx.moveTo(apparentTarget.x,baselineY);
            ctx.lineTo(apparentTarget.x,baselineY-20);
            ctx.stroke();
            //draw triangular flag
            ctx.beginPath()
            ctx.moveTo(apparentTarget.x,baselineY-20);
            ctx.lineTo(apparentTarget.x+8,baselineY-15);
            ctx.lineTo(apparentTarget.x,baselineY-10);
            ctx.fill();
            //floor
            ctx.strokeStyle="black";
            ctx.lineWidth=5;
            ctx.beginPath();
            ctx.moveTo(0,baselineY);
            ctx.lineTo(ctx.canvas.width,baselineY);
            ctx.stroke();
            //next loop
            requestAnimationFrame(loop);
        }
        //start loop
        requestAnimationFrame(loop); 
    });
}
export default runLanders;