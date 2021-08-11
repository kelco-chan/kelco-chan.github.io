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
        5, 4,
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
                //Methods.Mutation.ADD_SELF_CONN,
                //Methods.Mutation.SUB_SELF_CONN,
               // Methods.Mutation.ADD_BACK_CONN,
                //Methods.Mutation.SUB_BACK_CONN
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
    
    let target = CONFIG.initialConditions.targetDisplacement.copy()//.scale(0.07 + 0.007 * neat.generation,true);
    //init all the landers lol
    let landers = [];
    let startingVelocity = CONFIG.initialConditions.velocity.copy()//scale(0.07 + 0.007 * neat.generation,true);
    let startingPos = new Vector(0,0);
    //startingPos = target.shift(-100,-400,true);
    for(let genome of neat.population){
        let lander = new AILander(startingPos.shift(100*Math.random(),0, true), target, startingVelocity.copy(), genome);
        lander.a = (Math.PI/20) * (Math.random()-0.5) * 2;
        landers.push(lander);
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
    /*let averageStats = landers.filter(l=>l.brain).reduce((acc,{stats})=>({
        xoffset:acc.xoffset + stats.xoffset,
        v:acc.v + stats.v,
        fuel:acc.fuel + stats.fuel,
        score:acc.score + stats.score
    }),{
        xoffset:0,
        v:0,
        fuel:0,
        score:0
    });
    averageStats.xoffset *= (1/landers.length);
    averageStats.v *= (1/landers.length);
    averageStats.fuel *= (1/landers.length);
    averageStats.score *= (1/landers.length);*/
    
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
    
    localStorage.setItem("results",JSON.stringify(results));
    localStorage.setItem("population",JSON.stringify(neat.export()));
    localStorage.setItem("population-gen",neat.generation.toString());

    if(loop){
        train(neat,ctx,false,loop);
    }
}
export {train,initNeat,renderResults};