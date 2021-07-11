import Vector from "./physics/vector.js";

const CONFIG = {
    /*ENVIRONMENT CONFIG*/
    grav: 1.625, //m s^-2


    /**LANDER MASS SPECIFICTIONS */
    landerWetMass: 7678.9, //kg
    maxFuel: 8248 * 0.1, //kg
    landerHeight:7.01, //m


    /*THRUST SPECIFICATIONS*/
    maxAngularAcceleration:Math.PI/5, //rad s^-2,
    maxMainNozzleThrust:4.5e4, //N
    maxFuelMassRate: 14.74, //kg s^-1
    maxComponentSpeed:600, //m s^-1


    /*NEAT evolution CONFIG*/
    PLAYER_AMOUNT:300,
    MUTATION_RATE:0.7,
    ELITISM: 100,


    /*Viewport config*/
    width:1000,//px
    height:700,//px
    scale: 1.5,//6/7.01, //px m^-1
    simulationBackgroundColor:"rgba(255,255,255,1)",
    enablePrototypeScrolling:false,


    /*SIMULATION CONFIG*/
    maxFlightTime: 1 * 60 * 1000, //s
    simulationSpeed: 1,
    initialConditions:{
        angularDisplacement:- 16 / 180 * Math.PI,
        targetDisplacement: new Vector(548.6, 150/*152.4*/),//displacement of target relative to lander;
        velocity: new Vector(18.3, 4.87)
    },
}
CONFIG.set = function(property,value){
    CONFIG[property] = value;
}
export default CONFIG;