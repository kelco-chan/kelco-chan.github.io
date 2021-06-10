"use strict";
import CONFIG from "../config.js";
import AILander from "./ai-lander.mjs";
import Vector from "../physics/vector.js";
import KeyboardLander from "../physics/keyboard-lander.js";
import drawGraph from "../lib/neataptic-graph.js";
import runLanders from "../physics/simulation.js";

const containers = {
    statsDiv:document.querySelector(".genomeStats")
}

let {Neat,Methods,Architect} = neataptic;

function initNeat(){
    neataptic.Config.warnings = false;
    return new Neat(
        4, 3,
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

function deviate(maxAmplitude){
    return 2*maxAmplitude*Math.random()-maxAmplitude;
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
    }

    //woah pop into NEXT GENERATION <o/
    neat.generation++;
    if(firstRun){
        document.querySelector(".genomeStats").innerHTML=`<b>Computing generation ${neat.generation}...</b>`;
    }
    
    let target = CONFIG.initialConditions.targetDisplacement.shift(0,CONFIG.landerHeight/2,true);
    //init all the landers lol
    let landers = [];
    let startingVelocity = CONFIG.initialConditions.velocity;
    let startingPos = new Vector(0,0);
    
    for(let genome of neat.population){
        landers.push(new AILander(startingPos.copy(),target,startingVelocity.copy(),genome));
    }
    landers.push(new KeyboardLander(startingPos.copy(),target,startingVelocity.copy()));
    
    //run landers
    ctx.font="15px Calibri";
    ctx.fillStyle="#000";
    ctx.clearRect(0,0,CONFIG.width,CONFIG.height);
    ctx.fillText(`Computing generation ${neat.generation}`,0,30)
    await runLanders(landers,target,/*null*/(neat.generation%1===0)?ctx:null);
    debugger;
    console.log();
    
    //render the best genome
    if(CONFIG.drawNetworkGraph) drawGraph(neat.getFittest().graph(300,300),".bestGenome",600,600);
    //draw in the stuff
    let scores = neat.population.map(n=>n.score).sort((a,b)=>b-a)

    containers.statsDiv.innerHTML += `
    <b>Generation ${neat.generation} statistics</b>
    Human Player:
    Score: ${landers[landers.length-1].stats.score.toFixed(0)}

    AI:
    Q1 score: ${(scores[Math.floor(scores.length*3/4)]).toFixed(0)}
    Q3 score: ${(scores[Math.floor(scores.length*1/4)]).toFixed(0)}
    Max Score: ${neat.getFittest().score.toFixed(0)}


    <b> Now Running generation ${neat.generation+1} </b>
    `.replaceAll("\n","<br>");

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
export {train,initNeat};