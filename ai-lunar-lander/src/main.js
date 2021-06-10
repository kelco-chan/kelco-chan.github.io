import {train,initNeat} from "./ai/trainer.js";
import CONFIG from "./config.js";

const canvas = document.querySelector("canvas");
canvas.width = /*CONFIG.width*/canvas.offsetWidth;
canvas.height = /*CONFIG.height*/canvas.offsetHeight;
const ctx = canvas.getContext("2d");

document.querySelectorAll("input[type='checkbox']").forEach(i=>i.checked=false);

document.querySelector("input.simulationSpeed").addEventListener("input",function(){
    CONFIG.set("simulationSpeed",parseInt(this.value));
    document.querySelector("div.simulationSpeed span").innerHTML = this.value;
});
document.querySelector("input.pathTracing").addEventListener("change",function(){
    CONFIG.set("simulationBackgroundColor",this.checked?"rgba(255,255,255,0.05)":"rgba(255,255,255,1)");
});
document.querySelector(".enablePrototypeScrolling input").addEventListener("change",function(){
    CONFIG.set("enablePrototypeScrolling",this.checked);
});


let neat = initNeat();
train(neat,ctx,true);