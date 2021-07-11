import CONFIG from "../config.js";
import Vector from "./vector.js";
function runLanders(landers,target,ctx){
    return new Promise(function(res){
        let emptyRuns = 0;
        let lastRunTime = null;
        let apparentTarget = target.scale(CONFIG.scale,true);//location of target in pixels
        let baselineY =  ctx.canvas.height;
        let cameraOffset = new Vector(0,ctx.canvas.height - apparentTarget.y - CONFIG.landerHeight*CONFIG.scale/2);//offset in px;
        function loop(time){
            if(lastRunTime===null){
                lastRunTime = time;
            };
            let ms = (time-lastRunTime)*CONFIG.simulationSpeed;
            if(emptyRuns < 2){
                //allow 2 frames of doing nothing for ram to cache
                ms = 0;
                emptyRuns += 1;
            }
            ms = 15;
            //if(ms>500) ms=2;
            //add logic for stuff;=
            let landedCount = 0;
            for(var lander of landers){
                if(lander.finished){
                    landedCount += 1;
                }else{
                    lander.update(ms);
                }
            }
            if(landedCount === landers.length){
                for(let lander of landers){
                    lander.calculateStats();
                }
                res();
                return;
            }
            if(ctx){
                ctx.fillStyle = CONFIG.simulationBackgroundColor;
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
                for(var lander of landers){
                    lander.render(ctx,undefined,cameraOffset,false);
                }
                ctx.lineWidth= 2;
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
            }
            //ending stuff
            lastRunTime = time;
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop); 
    });
}
export default runLanders;