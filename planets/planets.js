CANVAS_WIDTH = 500;
CANVAS_HEIGHT = 500;

var vector = function(x,y){
	this.x = x;
	this.y = y;
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	this.norm = function(){
		return Math.sqrt(this.x**2 + this.y**2);
	};
	this.dist = function(v){
		return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2);
	};
	this.set =function(v){
		this.x = v.x;
		this.y = v.y;
	};
	this.times = function(num){
		this.x *= num;
		this.y *= num;
	};
	vector.diff = function(v1,v2){
		return new vector(v1.x-v2.x,v1.y-v2.y);
	};
};

PLANET_RADIUS = 10;

var planet = function(pos,vel,color){
	this.pos = pos;
	this.vel = vel;
	this.color = color;
	this.acc = new vector(0,0);
	this.update = function(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.pos.x,this.pos.y,PLANET_RADIUS,0,2*Math.PI);
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.fill();
	};
	this.applyAcc = function(g){
		this.acc.set(g);
	};
};

SUN_RADIUS = 20;
SUN_COLOR = "#FFAA22";
SUN_MASS = 5000;

var system = function(center,vel,color,radius){
	this.pos = center;
	this.vel = vel;
	this.acc = new vector(0,0);
	this.color = color;
	this.planets = [];
	this.radius = radius;
	this.add = function(p){
		this.planets.push(p);
	};
	this.getAcc = function(p){
		var tmp = vector.diff(this.pos,p);
		var d = tmp.norm();
		tmp.times(SUN_MASS/(d**3));
		return tmp;
	};
	this.applyAcc = function(g){
		this.acc.set(g);
	};
	this.update = function(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		for(var i in this.planets){
			var g = this.getAcc(this.planets[i].pos);
			this.planets[i].applyAcc(g);
			this.planets[i].update();
		};
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.pos.x,this.pos.y,this.radius,0,2*Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
		for(var i in this.planets)
			this.planets[i].draw(ctx);
	};
};

var clearScreen = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
};

var SPACE_COLOR = "#005599";
var NUM_STARS = 20;
var drawBackground = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = SPACE_COLOR;
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
	ctx.fillStyle = "#FFFFFF";
	for(var i = 0;i<NUM_STARS;i++){
		ctx.beginPath();
		ctx.arc(CANVAS_WIDTH*Math.random(),CANVAS_HEIGHT*Math.random(),2,0,2*Math.PI);
		ctx.fill();
	}
}