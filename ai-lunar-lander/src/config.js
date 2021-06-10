import Vector from "./physics/vector.js";

const CONFIG = {
    grav:9.8/6, //px s^-2
    scale: 1.5,//6/7.01, //px m^-1
    maxMainNozzleThrust:10.52, //ms^-1
    maxSideNozzleThrust:10.52*0.33, //m s^-1
    maxFuel:1500,
    maxComponentSpeed:600,//m s^-1
    PLAYER_AMOUNT:600,
    MUTATION_RATE:0.7,
    ELITISM: 200,
    width:1000,//px
    height:700,//px
    maxFlightTime: 60*1000,
    simulationSpeed: 1,
    drawNetworkGraph:false,
    landerHeight:7.01, //m
    simulationBackgroundColor:"rgba(255,255,255,1)",
    enablePrototypeScrolling:false,
    initialConditions:{
        targetDisplacement: new Vector(548.6, 152.4),//displacement of target relative to lander;
        velocity: new Vector(18.3, 4.87)
    }
}
CONFIG.set = function(property,value){
    CONFIG[property] = value;
}
export default CONFIG;