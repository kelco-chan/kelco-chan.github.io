import CONFIG from "../config.js";
import Vector from "./vector.js";
function runLanders(landers,target,ctx){
    return new Promise(function(res){
        let cameraOffset = new Vector(0,0);
        let lastRunTime = null;
        function loop(time){
            if(lastRunTime===null){
                lastRunTime = time;
            };
            let ms = time-lastRunTime;
            ms*=CONFIG.simulationSpeed;
            //clear canvas
            if(ctx){
                ctx.fillStyle = CONFIG.simulationBackgroundColor;
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
                //render target
                ctx.fillStyle = "black";
                ctx.fillRect(target.x*CONFIG.scale-5+cameraOffset.x,target.y*CONFIG.scale-5+cameraOffset.y,10,10);
            }
            //add logic for stuff;
            //optimise lander loop
            for(var lander of landers){
                lander.update(ms);
            }
            let renderPos;
            if(ctx){
                for(var lander of landers){
                    renderPos = lander.render(ctx,undefined,cameraOffset,false);
                }
                if(CONFIG.enablePrototypeScrolling){
                    if(renderPos.x < ctx.canvas.width*0.1){
                        cameraOffset.shift(Math.abs(landers[landers.length-1].v.x*ms/1000*0.7),0);
                    }
                    
                    if(renderPos.x > ctx.canvas.width*0.9){
                        cameraOffset.shift(-Math.abs(landers[landers.length-1].v.x*ms/1000*0.7),0);
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