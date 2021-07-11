"use strict";
import CONFIG from "../config.js";
import AILander from "./ai-lander.mjs";
import Vector from "../physics/vector.js";
import KeyboardLander from "../physics/keyboard-lander.js";
import RetrogradeLander from "../physics/retrograde-lander.js";
import DriftLander from "../physics/drift-lander.js";
import runLanders from "../physics/simulation.js";

let {Neat,Methods,Architect} = neataptic;

function initNeat(){
    neataptic.Config.warnings = false;
    return new Neat(
        7, 3,
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
function renderResults(container,generation){
    let results = localStorage.getItem("results") && JSON.parse(localStorage.getItem("results"));
    let result = results.find(stats=>stats.generation===generation);
    if(!result) {container.innerHTML = "Oops. There is no data for generation "+generation+". We are only up to generation "+(results[results.length-1].generation||"0")+"."; return;}
    let str = "";
    for(let landerStat of result.stats){
        str+=`
        <div>
            <b>Lander: <code>${landerStat.name}</code></b>
            > Horizontal Offset: ${landerStat.xoffset} m
            > Touchdown Velocity: ${landerStat.v} m/s
            > Fuel used: ${landerStat.fuel} kg
            --> Overall Score: ${landerStat.score}<--
        </div>
        `
    }
    container.innerHTML = str.replaceAll("\n","<br>")
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

let results = [];
async function train(neat,ctx,firstRun,loop){
    //start the target;
    if(firstRun && localStorage.getItem("population") && localStorage.getItem("population-gen")){
        results = JSON.parse(localStorage.getItem("results")) || [];
        neat.import(JSON.parse(localStorage.getItem("population")));
        neat.generation = parseInt(localStorage.getItem("population-gen"));
    }
    //woah pop into NEXT GENERATION <o/
    neat.generation++;
    telementry.break();
    telementry.log("Simulation","Generation "+neat.generation+" begin")
    
    let target = CONFIG.initialConditions.targetDisplacement.shift(/*deviate(30)*/0,CONFIG.landerHeight/2/*+deviate(30)*/,true);
    //init all the landers lol
    let landers = [];
    let startingVelocity = CONFIG.initialConditions.velocity;
    let startingPos = new Vector(0,0);
    
    for(let genome of neat.population){
        landers.push(new AILander(startingPos.copy(),target,startingVelocity.copy(),genome));
    }

    landers.push(new DriftLander(startingPos.copy(),target,startingVelocity.copy()));
    landers.push(new RetrogradeLander(startingPos.copy(),target,startingVelocity.copy()));
    landers.push(new KeyboardLander(startingPos.copy(),target,startingVelocity.copy()));
    
    //run landers
    ctx.font="15px Calibri";
    ctx.fillStyle="#000";
    ctx.clearRect(0,0,CONFIG.width,CONFIG.height);
    ctx.fillText(`Computing generation ${neat.generation}`,0,30);
    document.querySelector(".controls .currentGeneration").innerHTML = `Running generation ${neat.generation}...`;
    await runLanders(landers,target,ctx);
    //find all special ppl
    let specialLanders = landers.filter(lander=>!lander.brain);
    specialLanders.push(neat.getFittest());
    //draw in the stuff
    results.push({
        generation:neat.generation,
        stats:specialLanders.map(l=>({
            name:l.name || "AI",
            xoffset: l.stats.xoffset.toFixed(2),
            v:l.stats.v.toFixed(2),
            fuel: l.stats.fuel.toFixed(2),
            score:l.stats.score.toFixed(2),
        }))
    });

    localStorage.setItem("results",JSON.stringify(results));
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
    
    if(loop){
        train(neat,ctx,false,loop);
    }
}
export {train,initNeat,renderResults};