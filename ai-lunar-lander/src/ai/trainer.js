"use strict";
import CONFIG from "../config.js";
import AILander from "./ai-lander.mjs";
import Vector from "../physics/vector.js";
import KeyboardLander from "../physics/keyboard-lander.js";
import drawGraph from "../lib/neataptic-graph.js";

const containers = {
    statsDiv:document.querySelector(".genomeStats")
}

let {Neat,Methods,Architect} = neataptic;

function initNeat(){
    neataptic.Config.warnings = false;
    return new Neat(
        5, 3,
        null,
        {
            mutation: [
                Methods.Mutation.ADD_NODE,
                Methods.Mutation.SUB_NODE,
                Methods.Mutation.ADD_CONN,
                Methods.Mutation.SUB_CONN,
                Methods.Mutation.MOD_WEIGHT,
                Methods.Mutation.MOD_BIAS,
                Methods.Mutation.MOD_ACTIVATION,
                Methods.Mutation.ADD_GATE,
                Methods.Mutation.SUB_GATE,
                Methods.Mutation.ADD_SELF_CONN,
                Methods.Mutation.SUB_SELF_CONN,
                Methods.Mutation.ADD_BACK_CONN,
                Methods.Mutation.SUB_BACK_CONN
            ],
            popsize: CONFIG.PLAYER_AMOUNT,
            mutationRate: CONFIG.MUTATION_RATE,
            elitism: CONFIG.ELITISM
        }
        );
}
    

/**
 * Trains Landers
 * @param {Neat} neat 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Boolean} firstRun 
 * @param {Boolean} loop - whether or not to train again after thsi generation has finished;
 */
async function train(neat,ctx,firstRun,loop){
    //start the target;
    
    if(firstRun && localStorage.getItem("population") && localStorage.getItem("population-gen")){
        neat.import(JSON.parse(localStorage.getItem("population")));
        neat.generation = parseInt(localStorage.getItem("population-gen"));
        //render the best genome
        //drawGraph(neat.population[0].graph(300,300),".bestGenome",600,600);
    }

    //woah pop into NEXT GENERATION <o/
    neat.generation++;
    if(firstRun){
        document.querySelector(".genomeStats").innerHTML=`<b>Computing generation ${neat.generation}...</b>`;
    }
    
    let target = {
        x:CONFIG.width*Math.random(),
        y:CONFIG.height-10
    }
    //init all the landers lol
    let landers = [];
    let startingPos = new Vector(CONFIG.width*Math.random(),10);
    
    for(let genome of neat.population){
        landers.push(new AILander(startingPos.copy(),target,genome));
    }
    landers.push(new KeyboardLander(startingPos.copy(),target))
    
    //run landers
    ctx.font="15px Calibri";
    ctx.fillStyle="#000";
    ctx.clearRect(0,0,CONFIG.width,CONFIG.height);
    ctx.fillText(`Computing generation ${neat.generation}`,0,30)
    await runLanders(landers,target,/*null*/(neat.generation%1===0)?ctx:null);

    console.log();
    
    //render the best genome
    //drawGraph(neat.getFittest().graph(300,300),".bestGenome",600,600);
    //draw in the stuff
    let scores = neat.population.map(n=>n.score).sort((a,b)=>a-b)
    containers.statsDiv.innerHTML += `
    <b>Generation ${neat.generation} statistics</b>
    Human Player:
    Score: ${landers[landers.length-1].stats.score.toFixed(0)}

    AI:
    Median Score: ${(scores[Math.floor(scores.length/2)]).toFixed(0)}
    Max Score: ${neat.getFittest().score.toFixed(0)}


    <b> Now Running generation ${neat.generation+1} </b>
    `.replaceAll("\n","<br>");

    //scroll
    containers.statsDiv.scrollTop  = containers.statsDiv.scrollHeight;

    localStorage.setItem("population",JSON.stringify(neat.export()));
    localStorage.setItem("population-gen",neat.generation.toString());

    let newPopulation = [];
    // Elitism
    for(var i = 0; i < neat.elitism; i++){
        newPopulation.push(neat.population[i]);
    }
    
    // Breed the next individuals
    while(newPopulation.length < neat.popsize){
        newPopulation.push(neat.getOffspring());
    }
    
    // Replace the old population with the new population
    neat.population = newPopulation;
    neat.mutate();
    //all over again :)
    train(neat,ctx);
}
function runLanders(landers,target,ctx){
    return new Promise(function(res){
        let lastRunTime = null;
        function loop(time){
            if(lastRunTime===null){
                lastRunTime = time;
            };
            let ms = time-lastRunTime;
            ms*=CONFIG.simulationSpeed;
            //clear canvas
            if(ctx){
                ctx.fillStyle="rgba(255,255,255,1)";
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
                //render target
                ctx.fillStyle = "black";
                
                ctx.fillRect(target.x-5,target.y-5,10,10);
            }
            landers.forEach(l=>{
                ctx&&l.render(ctx);
                l.update(ms);
            });

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
async function replayBest(neat,ctx,startingPos,target){
    let landers = [new KeyboardLander(startingPos.copy(),target)];
    landers.push(new AILander(startingPos,target,neat.getFittest(),true));
    await runLanders(landers,target,ctx)
    ctx.clearRect(0,0,CONFIG.width,CONFIG.height)
}
export {train,initNeat};