var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;
var CANVAS_DIM = 500;

var BLOCK_COLOR = "#999999";
var BLOCK_WIDTH = 100;
var BLOCK_HEIGHT = 50;

var SHIP_DIM = 10;
var SHIP_SPEED = 40;
var SHIP_COLOR = "#AAAAAA";
var N_GENES = 20;

var GOAL_COLOR = "#FF2299";
var GOAL_RADIUS = 20;


var EVector = function(x,y){
	this.x = x;
	this.y = y;
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	this.dist = function(v){
		return Math.sqrt((this.x - v.x)**2 + (this.y - v.y)**2);
	};
	this.getAngle = function(v){
		var x = v.x;
		var y = v.y;
		return Math.atan(y/x);
	};	
	this.rotate = function(angle){
		var x = this.x;
		var y = this.y;
		this.x = x*Math.cos(angle) - y*Math.sin(angle);
		this.y = x*Math.sin(angle) + y*Math.cos(angle);
	};
}

var INIT_POS = new EVector(250,400);

var EShip = function(p){
	this.pos = p;
	this.vel = new EVector(0,-SHIP_SPEED);
	this.angle = 0;
	this.dangle = 0;
	this.index = 0;
	this.genes = [];
	this.collide = false;
	this.arrived = false;
	this.fitness = 0;

	for(var i = 0;i<N_GENES;i++)
		this.genes.push((Math.random()-0.5)*Math.PI/2);
	this.draw = function(ctx){
		ctx.save();
		ctx.translate(this.pos.x,this.pos.y);
		ctx.rotate(this.angle);
		ctx.fillStyle = SHIP_COLOR;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(-SHIP_DIM,SHIP_DIM);
		ctx.lineTo(SHIP_DIM,SHIP_DIM);
		ctx.lineTo(0,-SHIP_DIM);
		ctx.lineTo(-SHIP_DIM,SHIP_DIM);
		ctx.stroke();
		ctx.fill();
		ctx.restore();
	};

	this.update = function(){
		if(this.index < N_GENES && !this.collide && !this.arrived){
			this.dangle = this.genes[this.index];
			this.vel.rotate(this.dangle);
			this.angle += this.dangle;
			this.pos.add(this.vel);
			this.index++;
		}
	};

	this.hit = function(b){
		if(Math.abs(this.pos.x - b.pos.x)<BLOCK_WIDTH/2 && Math.abs(this.pos.y - b.pos.y)<BLOCK_HEIGHT/2)
			this.collide = true; 
	};
	this.reach = function(g){
		if(Math.abs(this.pos.x - g.pos.x)<GOAL_RADIUS && Math.abs(this.pos.y - g.pos.y)<GOAL_RADIUS)
			this.arrived = true;	
	};
	this.calculateFitness = function(g){
		var dx = Math.abs(this.pos.x - g.pos.x);
		var dy = Math.abs(this.pos.y - g.pos.y);
		this.fitness = 2*(1 - dx/CANVAS_WIDTH); 
		this.fitness += 2*(1 - dy/CANVAS_HEIGHT);
		if(this.hit){
			this.fitness /= 2;
		}
		if(this.reach){
			this.fitness *= 3;
		}
	};
	this.mix = function(s){
		var p;
		var n = [];
		var d = this.fitness + s.fitness;
		for(var i = 0;i<N_GENES;i++){
			p = Math.random()*d;
			if(p<=this.fitness)
				n.push(this.genes[i]);
			else if(p>this.fitness && p<=d)
				n.push(s.genes[i]);
			else
				n.push((Math.random()-0.5)*Math.PI);
		}
		var ns = new EShip(new EVector(250,500));
		ns.genes = n;
		return ns;
	};
};

var EBlock = function(p){
	this.pos = p;
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = BLOCK_COLOR;
		ctx.fillRect(this.pos.x - BLOCK_WIDTH/2,this.pos.y - BLOCK_HEIGHT/2,BLOCK_WIDTH,BLOCK_HEIGHT);
	};
};

var EGoal = function(p){
	this.pos = p;
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.fillStyle = GOAL_COLOR;
		ctx.arc(this.pos.x,this.pos.y,GOAL_RADIUS,0,2*Math.PI);
		ctx.fill();
	};	
};

var ESimulation = function(){
	this.ships = [];
	this.N_SHIPS = 50;
	this.block = new EBlock(new EVector(250,250));
	this.goal = new EGoal(new EVector(250,50));
	this.generation = 0;
	this.time = 0;
	this.max_fitness = 0;

	for(var i = 0;i<this.N_SHIPS;i++)
		this.ships.push(new EShip(new EVector(250,500)));
	this.draw = function(){
		this.block.draw(ctx);
		this.goal.draw(ctx);
		for(var i = 0;i<this.N_SHIPS;i++)
			this.ships[i].draw(ctx);
	};
	this.update = function(){
		for(var i = 0;i<this.N_SHIPS;i++){
			this.ships[i].update();
			this.ships[i].hit(this.block);
			this.ships[i].reach(this.goal);
		}
	};
	this.calculateFitness = function(){
		for(var i in this.ships){
			this.ships[i].calculateFitness(this.goal);
			this.max_fitness += this.ships[i].fitness;
		};
	};
	this.chooseParent = function(){
		var s = Math.random()*this.max_fitness;
		var a = 0
		for(var i in this.ships){
			a += this.ships[i].fitness
			if(a>=s){
				return i;
			}
		}
		return Math.round(Math.random()*this.N_SHIPS);
	};
	this.getNextGeneration = function(){
		var parent1;
		var parent2;
		var ng = [];
		this.calculateFitness();
		for(var i = 0;i<this.N_SHIPS;i++){
			parent1 = this.chooseParent();
			parent2 = this.chooseParent();
			ng.push(this.ships[parent1].mix(this.ships[parent2]));
		}
		this.max_fitness = 0;
		this.ships = ng;
	};
}

var clearScreen = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}