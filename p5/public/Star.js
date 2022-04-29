// stars
function Star(options){
    // this.size = Math.random()*2;
    // this.speed = Math.random()*.1;
    this.size = random(3);
    this.speed = random(0.15);
    this.x = options.x;
    this.y = options.y;
    this.color = options.color;
}

Star.prototype.reset = function(){
    this.size = Math.random()*2;
    this.speed = Math.random()*.1;
    this.x = width;
    this.y = Math.random()*height;
}

Star.prototype.update = function(){
    this.x-=this.speed;
    if(this.x<0){
        this.reset();
    }
}

Star.prototype.draw = function() {
    stroke(this.color)
    strokeWeight(this.size)
    point(this.x, this.y, this.size);
    strokeWeight(1)
}

const points = 100;

function StarHeart(posx, posy) {

    this.currAngle = 0;
    this.x = posx;
    this.y = posy;

}

function calcHeartPoint(angle) {
  const r = 10;
  const x = r * 14 * pow(sin(angle),3);
  const y = -r * (13 * cos(angle) - 5 * cos(2*angle) - 2 * cos(3*angle) - cos(4*angle));
  return { x , y };
}