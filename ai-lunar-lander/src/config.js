const CONFIG = {
    grav:15, //px s^-2
    nozzleThrust:1.7, //ms^-1
    maxNozzleThrust:10,
    minNozzleThrust:0,
    maxFuel:1500,
    maxComponentSpeed:600,
    PLAYER_AMOUNT:600,
    MUTATION_RATE:0.7,
    ELITISM: 200,
    width:1000,//window.innerWidth,
    height:700,//window.innerHeight,
    maxFlightTime: 25*1000,
    simulationSpeed: 1
}
CONFIG.set = function(property,value){
    CONFIG[property] = value;
}
export default CONFIG;