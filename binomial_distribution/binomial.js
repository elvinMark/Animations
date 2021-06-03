var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 800;

var MARGIN_X = 0;
var MARGIN_Y = 0;

var WORLD_WIDTH = CANVAS_WIDTH - 2*MARGIN_X;
var WORLD_HEIGHT = CANVAS_HEIGHT - 2*MARGIN_Y;

var vector = function(x,y){
	this.x = x;
	this.y = y;
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	this.dist = function(v){
		return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2);
	};
	this.times = function(num){
		this.x *= num;
		this.y *= num;
	};
	this.norm = function(){
		return Math.sqrt(this.x**2 + this.y**2);
	};
	this.normalize = function(){
		var d = this.norm();
		this.x /= d;
		this.y /= d;
	};
	vector.diff = function(v1,v2){
		return new vector(v1.x - v2.x,v1.y - v2.y);
	}
};

var BALL_RADIUS = 10;
var BALL_COLOR = "#AA0000";
var u = 0.5;

var ball = function(pos){
	this.pos = pos;
	this.vel = new vector(0,0);
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = BALL_COLOR;
		ctx.arc(this.pos.x,this.pos.y,BALL_RADIUS,0,2*Math.PI);
		ctx.fill()
	};
	this.update = function(){
		this.pos.add(this.vel);
		if(this.pos.x - BALL_RADIUS< MARGIN_X){
			this.vel.x = -u*this.vel.x;
			this.pos.x = MARGIN_X + BALL_RADIUS;
		}
		if(this.pos.x + BALL_RADIUS> CANVAS_WIDTH - MARGIN_X){
			this.vel.x = -u*this.vel.x;
			this.pos.x = CANVAS_WIDTH - MARGIN_X- BALL_RADIUS;
		}
		if(this.pos.y - BALL_RADIUS< MARGIN_Y){
			this.vel.y = -u*this.vel.y ;
			this.pos.y = MARGIN_X + BALL_RADIUS;
		}
		if(this.pos.y + BALL_RADIUS> CANVAS_HEIGHT - MARGIN_Y){
			this.vel.y = -u*this.vel.y;
			this.pos.y = CANVAS_HEIGHT - MARGIN_Y -BALL_RADIUS; 
		}	
	};
	this.applyAcc = function(acc){
		this.vel.add(acc);
	};
};

var BLOCK_COLOR = "#000000";
var BLOCK_RADIUS = 10;
var block = function(pos){
	this.pos = pos;
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = BLOCK_COLOR;
		ctx.arc(this.pos.x,this.pos.y,BLOCK_RADIUS,0,2*Math.PI);
		ctx.fill();
	};
	this.isColliding = function(b){
		return this.pos.dist(b.pos) < BLOCK_RADIUS+BALL_RADIUS;
	};
	this.collide = function(b){
		if(this.isColliding(b)){
			var v = b.vel.norm();
			b.vel = vector.diff(b.pos,this.pos);
			b.vel.normalize();
			b.vel.times(u*v);
			//b.vel.timesScalar(-u);
		};
	};
};

var WALL_HEIGHT = 200;
var WALL_WIDTH = 5;
var WALL_COLOR = "#0000AA";
var wall = function(pos){
	this.pos = pos;
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = WALL_COLOR;
		ctx.fillRect(this.pos.x,this.pos.y,WALL_WIDTH,WALL_HEIGHT);
	};
	this.isColliding = function(b){
		var dx = Math.abs(this.pos.x + WALL_WIDTH/2 - b.pos.x);
		var dy = Math.abs(this.pos.y + WALL_HEIGHT/2 - b.pos.y);
		return dx<(WALL_WIDTH/2 + BALL_RADIUS/2) && dy<(WALL_HEIGHT/2);   
	};
	this.collide = function(b){
		if(this.isColliding(b)){
			b.vel.x = -u*b.vel.x;
			if(b.pos.x<this.pos.x){
				b.pos.x = this.pos.x-BALL_RADIUS;
			}
			else{
				b.pos.x = this.pos.x+BALL_RADIUS+WALL_WIDTH;	
			}
			b.vel.y = 0;
		}
	};
};

var clearScreen = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
};
