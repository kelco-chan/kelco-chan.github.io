const CONFIG = {
    grav:9.8/6*4, //px s^-2
    scale: 6/7.01, //px m^-1
    maxMainNozzleThrust:2.97, //ms^-1
    maxSideNozzleThrust:2.97*0.3, //m s^-1
    maxFuel:1500,
    maxComponentSpeed:600,//m s^-1
    PLAYER_AMOUNT:600,
    MUTATION_RATE:0.7,
    ELITISM: 200,
    width:1000,//px
    height:700,//px
    maxFlightTime: 30*1000,
    simulationSpeed: 1,
    drawNetworkGraph:false,
    landerHeight:7.01, //m
    simulationBackgroundColor:"rgba(255,255,255,1)",
    enablePrototypeScrolling:false
}
CONFIG.set = function(property,value){
    CONFIG[property] = value;
}
export default CONFIG;