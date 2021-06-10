import Lander from "./lander.js";
let pressed = {};
document.addEventListener("keydown",(e)=>{
    pressed[e.key]=true;
});
document.addEventListener("keyup",(e)=>{
    pressed[e.key]=false;
});
class KeyboardLander extends Lander{
    constructor(){
        super(...arguments);
        this.isPlayer = true;
    }
    update(ms){
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
    calculateStats(){
        super.calculateStats(...arguments);
        //console.log("Player score",this.stats.score);
        //console.log("Stats",this.stats)
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