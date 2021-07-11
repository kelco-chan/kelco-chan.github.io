/*MUST BE INCLUDED USING SCRIPT TAG SINCE PUBLIC VARIABLE*/
let container;
const telementry = {
    log:function(source,msg){
        container.innerHTML += "<b>" + source + ":</b> " + msg +"<br>"
        container.scrollTop = container.scrollHeight;
    },
    break:function(){
        container.innerHTML += "<hr>";
        container.scrollTop = container.scrollHeight;
    }
}
document.addEventListener("DOMContentLoaded",function(){
    container = document.querySelector(".telementrywindow");
    
})