import Lander from "./lander.js";
import CONFIG from "../config.js";
let pressed = {};
let hide = false;
document.addEventListener("keydown",(e)=>{
    pressed[e.key]=true;
    if(e.key === "h"){
        hide = !hide;
    }
});
document.addEventListener("keyup",(e)=>{
    pressed[e.key]=false;
});
class KeyboardLander extends Lander{
    constructor(){
        super(...arguments);
        this.isPlayer = true;
        this.name="Player";
    }
    update(ms){
        this.hidden = hide;
        if(pressed.ArrowUp){
            this.fireNozzle(2,1,ms);
        }
        if(pressed.ArrowLeft){
            this.fireNozzle(0,1,ms);
        }
        if(pressed.ArrowRight){
            this.fireNozzle(1,1,ms);
        }
        super.update(...arguments);
    }
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx,_,offset){
        return super.render(ctx,"green",offset,false);
    }
}
export default KeyboardLander;