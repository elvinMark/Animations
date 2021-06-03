var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

var signal = [[true,true,true,true,true,true,false],[false,true,true,false,false,false,false],[true,true,false,true,true,false,true],[true,true,true,true,false,false,true],[false,true,true,false,false,true,true],[true,false,true,true,false,true,true],[true,false,true,true,true,true,true],[true,true,true,false,false,false,false],[true,true,true,true,true,true,true],[true,true,true,true,false,true,true]];

var block = function(x,y,w,h,rotated){
	this.state = false;
	this.rotated = rotated;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.draw = function(ctx){
		ctx.save();
		ctx.translate(this.x,this.y);
		if(this.rotated)
			ctx.rotate(Math.PI/2);
		ctx.beginPath();
		ctx.moveTo(-this.w/2,0);
		ctx.lineTo(-this.w/2 + this.h/2,-this.h/2);
		ctx.lineTo(this.w/2 - this.h/2,-this.h/2);
		ctx.lineTo(this.w/2,0);
		ctx.lineTo(this.w/2 - this.h/2,this.h/2);
		ctx.lineTo(-this.w/2 + this.h/2,this.h/2);
		ctx.lineTo(-this.w/2,0);
		if(this.state){
			ctx.fillStyle = "#FF0000";
			ctx.fill();
		}
		ctx.stroke();
		ctx.restore();
	};
	this.rotate = function(){
		this.rotated = !this.rotated;
	};
	this.on = function(){
		this.state = true;
	};
	this.off = function(){
		this.state = false;
	};
};

var digit = function(x,y,dim){
	this.x = x;
	this.y = y;
	this.dim = dim;
	this.h = this.dim/2;
	this.w = 2*this.dim;
	this.num = 0;

	this.blocks = [];
	this.blocks.push(new block(this.x,this.y - 8*this.h,2*this.w,2*this.h,false));
	this.blocks.push(new block(this.x + this.w ,this.y - 4*this.h,2*this.w,2*this.h,true));
	this.blocks.push(new block(this.x + this.w ,this.y + 4*this.h,2*this.w,2*this.h,true));
	this.blocks.push(new block(this.x,this.y + 8*this.h,2*this.w,2*this.h,false));
	this.blocks.push(new block(this.x - this.w ,this.y + 4*this.h,2*this.w,2*this.h,true));
	this.blocks.push(new block(this.x - this.w,this.y - 4*this.h,2*this.w,2*this.h,true));
	this.blocks.push(new block(this.x,this.y,2*this.w,2*this.h,false));
	
	this.setNum = function(num){
		for(var i = 0;i<7;i++){
			if(signal[num][i])
				this.blocks[i].on();
			else
				this.blocks[i].off();
		}
	};
	this.update = function(){

	};
	this.draw = function(ctx){
		for(var i in this.blocks){
			this.blocks[i].draw(ctx);
		}
	};
};

var digitalClock = function(x,y,dim){
	this.x = x;
	this.y = y;
	this.hour = 0;
	this.min = 59;
	this.sec = 0;
	this.dim = dim;
	this.digits = [];

	this.digits.push(new digit(this.x-12*this.dim,this.y,this.dim));
	this.digits.push(new digit(this.x-6*this.dim,this.y,this.dim));
	this.digits.push(new digit(this.x+this.dim,this.y,this.dim));
	this.digits.push(new digit(this.x+7*this.dim,this.y,this.dim));
	this.digits.push(new digit(this.x+14*this.dim,this.y,this.dim));
	this.digits.push(new digit(this.x+20*this.dim,this.y,this.dim));

	this.draw = function(ctx){
		for(var i in this.digits){
			this.digits[i].draw(ctx);
		}
	};
	this.update = function(){
		var d1,d2;
		this.sec++;
		if(this.sec==60){
			this.sec = 0;
			this.min++;
		}
		if(this.min == 60){
			this.min = 0;
			this.hour++;
		}
		if(this.hour == 12){
			this.hour = 0;
		}
		d1 = Math.floor(this.hour/10);
		d2 = this.hour - 10*d1;
		this.digits[0].setNum(d1);
		this.digits[1].setNum(d2);
		d1 = Math.floor(this.min/10);
		d2 = this.min - 10*d1;
		this.digits[2].setNum(d1);
		this.digits[3].setNum(d2);
		d1 = Math.floor(this.sec/10);
		d2 = this.sec - 10*d1;
		this.digits[4].setNum(d1);
		this.digits[5].setNum(d2);
	};
};

var clearScreen = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
};