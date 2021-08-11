import Vector from "./physics/vector.js";

const CONFIG = {
    /*ENVIRONMENT CONFIG*/
    grav: 1.625, //m s^-2


    /**LANDER MASS SPECIFICTIONS */
    landerWetMass: 7864, //kg
    maxFuel: 1009, //kg
    averageMass:7359,
    landerHeight:7.01, //m


    /*THRUST SPECIFICATIONS*/
    maxAngularAcceleration:Math.PI/5, //rad s^-2,
    maxMainNozzleThrust:4.5e4, //N
    maxFuelMassRate: 14.74, //kg s^-1
    maxComponentSpeed:600, //m s^-1


    /*NEAT evolution CONFIG*/
    PLAYER_AMOUNT:300,
    MUTATION_RATE:0.4,
    ELITISM: 50,


    /*Viewport config*/
    width:1000,//px
    height:400,//px
    scale: 1.3,//1.5,//6/7.01, //px m^-1
    simulationBackgroundColor:"rgba(255,255,255,1)",
    enablePrototypeScrolling:false,


    /*SIMULATION CONFIG*/
    maxFlightTime: 3 * 60 * 1000, //ms
    simulationSpeed: 1,
    initialConditions:{
        angularDisplacement: -55 / 180 * Math.PI,
        targetDisplacement: new Vector(8334, 2290),//displacement of target relative to lander;
        velocity: new Vector(148, 44.2) 
    },
}
CONFIG.set = function(property,value){
    CONFIG[property] = value;
}
export default CONFIG;