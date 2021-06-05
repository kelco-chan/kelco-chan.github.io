class Vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    get magnitude(){
        return Math.hypot(this.x,this.y);
    }
    /**
     * @param {Vector} v2 - the other vector
     * @param {Boolean} returnnew - whether or not to return new vector
     */
    add(v2,returnnew){
        if(returnnew){
            return new Vector(this.x+v2.x,this.y+v2.y);
        }else{
            this.x+=v2.x;
            this.y+=v2.y;
            return this;
        }
    }
    scale(scale,returnnew){
        if(returnnew){
            return new Vector(this.x*scale,this.y*scale);
        }else{
            this.x*=scale;
            this.y&=scale;
            return this;
        }
    }
    copy(){
        return new Vector(this.x,this.y);
    }
    scaleTo(magnitude,returnnew){
        return this.scale(magnitude/this.magnitude,returnnew);
    }
    toString(){
        return `X: ${this.x} Y: ${this.y}`;
    }
}
export default Vector;