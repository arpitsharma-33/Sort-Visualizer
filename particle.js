class Particle{
    constructor(loc,fixed=false){
        this.loc = loc;
        this.oldLoc = loc;
        this.fixed = fixed;
    }

    update(force){
        if(this.fixed){
            return;
        }
        const vel = subtract(this.loc,this.oldLoc);
        const newLoc = add(this.loc,vel);
        const withGravity = add(newLoc,
            {x:0, y:force}
        );
        this.oldLoc = this.loc;
        this.loc = withGravity;
    }

    draw(ctx, radius=5){
        ctx.beginPath();
        ctx.fillStyle="green";
        ctx.arc(this.loc.x,this.loc.y,radius,0,Math.PI*2);
        ctx.fill();
    }
}