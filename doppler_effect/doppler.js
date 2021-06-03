var CANVAS_HEIGHT = 500;
var CANVAS_WIDTH = 500;

var vector = function(x,y){
	this.x = x;
	this.y = y;
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
};

var wave_speed = 10;
var source_speed = 10;
var SOURCE_SIZE = 5;

var wave = function(pos){
	this.pos = pos;
	this.r = 10;
	this.update = function(){
		this.r += wave_speed;
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.pos.x,this.pos.y,this.r,0,2*Math.PI);
		ctx.stroke();
	};
};

var source = function(pos){
	this.pos = pos;
	this.vel = new vector(source_speed,0);
	this.update = function(){
		this.pos.add(this.vel);
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = "#FF0000";
		ctx.arc(this.pos.x,this.pos.y,SOURCE_SIZE,0,2*Math.PI);
		ctx.fill();
	};
	this.ray = function(){
		return new wave(new vector(this.pos.x,this.pos.y));
	};
};

var cleanScreen = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}