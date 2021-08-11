import {train,initNeat,renderResults} from "./ai/trainer.js";
import CONFIG from "./config.js";
window.addEventListener("load",function(){
    
    const canvas = document.querySelector("canvas");
    canvas.width = /*CONFIG.width*/canvas.offsetWidth;
    canvas.height = /*CONFIG.height*/canvas.offsetHeight;
    const ctx = canvas.getContext("2d");

    canvas.addEventListener("wheel",function(e){
        e.preventDefault();
        CONFIG.set("scale", CONFIG.scale * Math.pow(2, -0.001 * e.deltaY))
    })
    
    document.querySelector("input.generation-view").addEventListener("keyup",function(e){
        if(!/^\d+$/.exec(this.value)) return
        renderResults(document.querySelector(".genomeStats .results"),parseInt(this.value))
    });
    document.querySelector("input.generation-view").addEventListener("change",function(e){
        if(!/^\d+$/.exec(this.value)) return
        renderResults(document.querySelector(".genomeStats .results"),parseInt(this.value))
    });
    let neat = initNeat();
    train(neat,ctx,true,true);
})