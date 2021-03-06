(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
		window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	window.requestAnimationFrame = requestAnimationFrame;
})();

function calcHeartPoint(angle) {
	const r = 5;
	const x = r * 14 * Math.pow(Math.sin(angle),3);
	const y = -r * (13 * Math.cos(angle) - 5 * Math.cos(2*angle) - 2 * Math.cos(3*angle) - Math.cos(4*angle));
	return { x , y };
}

// Terrain stuff.
var terrain = document.getElementById("terCanvas"),
	background = document.getElementById("bgCanvas"),
	terCtx = terrain.getContext("2d"),
	bgCtx = background.getContext("2d"),
	width = window.innerWidth,
	height = document.body.offsetHeight;
(height < 400)?height = 400:height;

terrain.width = background.width = width;
terrain.height = background.height = height;

// Some random points
var points = [],
	displacement = 140,
	power = Math.pow(2,Math.ceil(Math.log(width)/(Math.log(2))));

// set the start height and end height for the terrain
points[0] = (height - (Math.random()*height/2))-displacement;
points[power] = (height - (Math.random()*height/2))-displacement;

// create the rest of the points
for(var i = 1; i<power; i*=2){
	for(var j = (power/i)/2; j <power; j+=power/i){
		points[j] = ((points[j - (power/i)/2] + points[j + (power/i)/2]) / 2) + Math.floor(Math.random()*-displacement+displacement );
	}
	displacement *= 0.6;
}

// draw the terrain
terCtx.beginPath();
				
for(var i = 0; i<=width; i++){
	if(i === 0){
		terCtx.moveTo(0, points[0]);
	}else if(points[i] !== undefined){
		terCtx.lineTo(i, points[i]);
	}
}

terCtx.lineTo(width,terrain.height);
terCtx.lineTo(0,terrain.height);
terCtx.lineTo(0,points[0]);
terCtx.fill();


// Second canvas used for the stars
bgCtx.fillStyle = '#05004c';
bgCtx.fillRect(0,0,width,height);

// stars
function Star(options){
	this.size = Math.random()*2;
	this.speed = Math.random()*.1;
	this.x = options.x;
	this.y = options.y;
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
	bgCtx.fillRect(this.x,this.y,this.size,this.size); 
}

function StarHeart(x, y) {
	this.status = 'active';
	this.lingerCount = 1000;
	this.starCount = 100;
	this.x = x;
	this.y = y;
	// this.step = Math.PI*2/this.stars;
	this.stars = [];
	this.updateCount = 0;
}

StarHeart.prototype.update = function() {
	for (let steps = 2; steps > 0; steps--) {
		if (this.updateCount < this.starCount) {
			const angle = this.updateCount/this.starCount * Math.PI * 2;
			const { x: xoff, y: yoff } = calcHeartPoint(angle);
			this.stars.push(new Star({
				x: this.x + xoff,
				y: this.y + yoff,
			}));
		} else if (this.updateCount > this.starCount) {
			// this.stars = [];
			// this.status = 'off';
		}
		this.updateCount++;
	}
	this.stars.forEach(s => s.update());
}

StarHeart.prototype.draw = function() {
	this.stars.forEach(s => s.draw());
}

function ShootingStar(){
	this.reset();
}

ShootingStar.prototype.reset = function(){
	this.x = Math.random()*width;
	this.y = 0;
	this.len = (Math.random()*80)+10;
	this.speed = (Math.random()*10)+10;
	this.size = (Math.random()*1)+0.1;
// this is used so the shooting stars arent constant
	this.waitTime =  new Date().getTime() + (Math.random()*3000)+500;
	this.active = false;
}

ShootingStar.prototype.update = function(){
	if(this.active){
		this.x-=this.speed;
		this.y+=this.speed;
		if(this.x < 0 - this.len || this.y >= height + this.len){
			this.reset();
		}
	}else{
		if(this.waitTime < new Date().getTime()){
			this.active = true;
		}			
	}
}

ShootingStar.prototype.draw = function() {
	if (this.active && !(this.x < 0 - this.len || this.y >= height + this.len)) {
		bgCtx.lineWidth = this.size;
		bgCtx.beginPath();
		bgCtx.moveTo(this.x,this.y);
		bgCtx.lineTo(this.x+this.len, this.y-this.len);
		bgCtx.stroke();
	}
}

var entities = [];

// init the stars
for(var i=0; i < height; i++){
	entities.push(new Star({x:Math.random()*width, y:Math.random()*height}));
}

// Add 2 shooting stars that just cycle.
entities.push(new ShootingStar());
entities.push(new ShootingStar());

//animate background
function animate(){
	bgCtx.fillStyle = '#05004c';
	bgCtx.fillRect(0,0,width,height);
	bgCtx.fillStyle = '#ffffff';
	bgCtx.strokeStyle = '#ffffff';

	var entLen = entities.length;
	
	while(entLen--){
		entities[entLen].update();
		entities[entLen].draw();
	}
	
	requestAnimationFrame(animate);
}
animate();

// const canvas = document.querySelector('canvas');
terrain.addEventListener('click', e => {
	// console.log('canvas clicked!', { x: e.x, y: e.y });
	entities.push(new StarHeart(e.x, e.y));
	e.preventDefault();
})

const DUR_MILLIS = 15_000;
// Moon stuff 
function createFloatingText(text) {
	const randx = Math.random()*width*2/5 + width/4;
	const randy = Math.random()*height/2 + height/3;
	const myDiv = document.createElement('div', {
	});
	myDiv.innerText = text;
	myDiv.className = 'text-float-disappear';
	myDiv.style.position = 'absolute';
	myDiv.style.left = `${randx}px`;
	myDiv.style.top = `${randy}px`;
	document.querySelector('main').appendChild(myDiv);
	setTimeout(() => {
		document.querySelector('main').removeChild(myDiv);
	}, DUR_MILLIS)
}

const phrases = [
	'Linda amor :)',
	'Te amo <3',
	'Mi coraz??n de mel??n :3',
	'Eres mi mejor amiga',
	'Mi dulce nieve de lim??n',
	'Te amo much??simo!',
	'Siempre me haces sonre??r :D',
];

let moonPhraseIt = 0;

const moon = document.querySelector('.moon');

moon.addEventListener('click', e => {
	createFloatingText(phrases[moonPhraseIt]);
	moonPhraseIt = moonPhraseIt === phrases.length-1 ? 0 : moonPhraseIt + 1;
});
const intro = [
	'No puedo bajarte la luna...',
	'Pero s?? llenarte este cielo de estrellas',
	'PS: son pistas amor :P',
];

// Set initial messages for amor amor <3
setTimeout(() => createFloatingText(intro[0]), 500+DUR_MILLIS*0)
setTimeout(() => createFloatingText(intro[1]), 500+DUR_MILLIS*1)
setTimeout(() => createFloatingText(intro[2]), 500+DUR_MILLIS*2)