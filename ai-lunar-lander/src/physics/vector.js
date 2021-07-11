Number.prototype.round = function(){
    return Math.round(this * 100) / 100;
}
class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    get magnitude(){
        return Math.hypot(this.x,this.y);
    }
    get angle(){
        //returns in radians from normal, clockwise +ve
        return Math.atan(this.x/this.y);
    }
    /**
     * @param {Vector} v2 - the other vector
     * @param {Boolean} returnnew - whether or not to return new vector
     */
    add(v2,returnnew){
        return this.shift(v2.x,v2.y,returnnew);
    }
    shift(x,y,returnnew){
        if(returnnew){
            return new Vector(this.x+x,this.y+y);
        }else{
            this.x+=x;
            this.y+=y;
            this.x = this.x;
            this.y = this.y;
            return this;
        }
    }
    scale(scale,returnnew){
        if(returnnew){
            return new Vector(this.x*scale,this.y*scale);
        }else{
            this.x *= scale;
            this.y *= scale;
            return this;
        }
    }
    copy(){
        return new Vector(this.x,this.y);
    }
    scaleTo(magnitude=10,returnnew){
        return this.scale(magnitude/this.magnitude,returnnew);
    }
    /**
     * 
     * @param {Number} angle - angle to turn in rad. +ve for clockwise
     * @param {Boolean} returnnew - whether or not to return a new vector
     */
    rotate(angle,returnnew){
        if(returnnew){
            return new Vector(
                this.x * Math.cos(-angle) - this.y * Math.sin(-angle),
                this.x * Math.sin(-angle) + this.y * Math.cos(-angle)
            )
        }else{
            let _x = this.x * Math.cos(-angle) - this.y * Math.sin(-angle);
            let _y = this.x * Math.sin(-angle) + this.y * Math.cos(-angle);
            this.x = _x;
            this.y = _y;
            return this;
        }
    }
    set(x,y){
        this.x = x;
        this.y = y;
        return this;
    }
    toString(){
        return `X: ${this.x} Y: ${this.y}`;
    }
}
export default Vector;