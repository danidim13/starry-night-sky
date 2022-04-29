
function ShootingStar(){
    this.reset();
}

ShootingStar.prototype.reset = function(){
    this.x = Math.random()*width;
    this.y = 0;
    this.len = random(30, 90);
    this.speed = random(15, 20);
    this.size = random(0.1, 0.5);
// this is used so the shooting stars arent constant
    this.waitTime =  new Date().getTime() + (Math.random()*3000)+500;
    this.active = false;
}

ShootingStar.prototype.update = function(){
    if(this.active){
        this.x-=this.speed;
        this.y+=this.speed;

        if (this.x< 0-this.len || this.y >= height + this.len){
            this.reset();
        } else {

        this.draw();
        
        // bgCtx.lineWidth = this.size;
        //     bgCtx.beginPath();
        //     bgCtx.moveTo(this.x,this.y);
        //     bgCtx.lineTo(this.x+this.len, this.y-this.len);
        //     bgCtx.stroke();
        }
    }else{
        if(this.waitTime < new Date().getTime()){
            this.active = true;
        }			
    }
}

ShootingStar.prototype.draw = function(){
    stroke('#ffffff');
    strokeWeight(this.size+(this.y/height)*0.9);
    line(this.x, this.y, this.x + this.len, this.y - this.len);
    strokeWeight(1)
}