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
    update(){
        if(pressed.ArrowUp){
            this.fireNozzle(2,0.5);
        }
        if(pressed.ArrowLeft){
            this.fireNozzle(0,0.5);
        }
        if(pressed.ArrowRight){
            this.fireNozzle(1,0.5);
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
    render(ctx){
        super.render(ctx,"green",false);
    }
}
export default KeyboardLander;