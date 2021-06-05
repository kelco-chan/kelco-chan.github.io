import {train,initNeat} from "./ai/trainer.js";
import CONFIG from "./config.js";

const canvas = document.querySelector("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");

document.querySelector("input.simulationSpeed").addEventListener("input",function(){
    CONFIG.set("simulationSpeed",parseInt(this.value));
    document.querySelector("div.simulationSpeed span").innerHTML = this.value;
});


let neat = initNeat();
train(neat,ctx,true);