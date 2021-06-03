var CANVAS_WIDTH = 500;
var CANVAS_HEIGHT = 500;

var clock = function(size){
	this.size = size;
	this.hour = 0;
	this.min = 50;
	this.sec = 0;
	this.update = function(){
		this.sec++;
		if(this.sec == 60){
			this.min++;
			this.sec = 0;
		}
		if(this.min == 60){
			this.hour++;
			this.min = 0;
		}
		if(this.hour == 12){
			this.hour = 0;
		}
	};
	this.draw = function(ctx){
		var angle = Math.PI/6;
		var x,y;
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.fillStyle = "#000000";
		ctx.arc(CANVAS_WIDTH/2,CANVAS_HEIGHT/2,this.size,0,2*Math.PI);
		ctx.font = "30px Arial";
		for(var i = 1;i<13;i++){
			x = CANVAS_WIDTH/2 + 0.9*this.size*Math.cos(-Math.PI/2 + i*angle);
			y = CANVAS_HEIGHT/2 + 0.9*this.size*Math.sin(-Math.PI/2 + i*angle);
			ctx.fillText(""+i,x-15,y+10);
		}
		ctx.stroke();
		ctx.beginPath();
		ctx.lineWidth = 1;
		angle = -Math.PI/2 + this.sec*Math.PI/30;
		x = CANVAS_WIDTH/2 + this.size*0.8*Math.cos(angle);
		y = CANVAS_HEIGHT/2 + this.size*0.8*Math.sin(angle);
		ctx.moveTo(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
		ctx.lineTo(x,y);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 3;
		angle = -Math.PI/2 + this.min*Math.PI/30;
		x = CANVAS_WIDTH/2 + this.size*0.7*Math.cos(angle);
		y = CANVAS_HEIGHT/2 + this.size*0.7*Math.sin(angle);
		ctx.moveTo(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
		ctx.lineTo(x,y);
		ctx.stroke();

		ctx.beginPath();
		ctx.lineWidth = 5;
		angle = -Math.PI/2 + this.hour*Math.PI/6;
		x = CANVAS_WIDTH/2 + this.size*0.6*Math.cos(angle);
		y = CANVAS_HEIGHT/2 + this.size*0.6*Math.sin(angle);
		ctx.moveTo(CANVAS_WIDTH/2,CANVAS_HEIGHT/2);
		ctx.lineTo(x,y);
		ctx.stroke();
	};
};

var clearScreen = function(ctx){
	ctx.beginPath();
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}