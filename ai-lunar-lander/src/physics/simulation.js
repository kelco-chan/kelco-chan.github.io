import CONFIG from "../config.js";
import Vector from "./vector.js";
function runLanders(landers,target,ctx){
    return new Promise(function(res){
        let lastRunTime = null;
        let apparentTarget = target.scale(CONFIG.scale,true);//location of target in pixels
        let baselineY =  ctx.canvas.height;
        let cameraOffset = new Vector(0,ctx.canvas.height - apparentTarget.y - CONFIG.landerHeight*CONFIG.scale/2);//offset in px;
        function loop(time){
            if(lastRunTime===null){
                lastRunTime = time;
            };
            let ms = time-lastRunTime;
            ms *= CONFIG.simulationSpeed;
            //add logic for stuff;
            //optimise lander loop
            for(var lander of landers){
                lander.update(ms);
            }
            let renderPos;
            if(ctx){
                
                ctx.fillStyle = CONFIG.simulationBackgroundColor;
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

                for(var lander of landers){
                    renderPos = lander.render(ctx,undefined,cameraOffset,false);
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
                //fdraw triangular flag
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
                if(CONFIG.enablePrototypeScrolling){
                    if(renderPos.x < ctx.canvas.width*0.1){
                        cameraOffset.shift(Math.abs(landers[landers.length-1].v.x*ms/1000),0);
                    }
                    
                    if(renderPos.x > ctx.canvas.width*0.9){
                        cameraOffset.shift(-Math.abs(landers[landers.length-1].v.x*ms/1000),0);
                    }
                }
            }

            if(landers.every(l=>l.finished)){
                res();
                return;
            }
            //ending  stuff
            lastRunTime = time;
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop); 
    });
}
export default runLanders;