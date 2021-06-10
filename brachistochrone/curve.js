var ctx;
var WIDTH;
var HEIGHT;

var HEX = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

var xmin = 0;
var xmax = 5;
var ymin = 0;
var ymax = 5;

function createCanvas(w,h){
	document.body.innerHTML = "<canvas id='mycanvas' width='" +w+"' height='"+ h+ "' style='border: solid 2px;'></canvas>";
	ctx = document.getElementById("mycanvas").getContext("2d");
	WIDTH = w;
	HEIGHT = h;
}

function dec2hex(num){
	if(num<16){
		return HEX[num];
	}
	else{
		return dec2hex(Math.floor(num/16)) + HEX[num%16];
	}
}

function rgb(r,g,b){
	var nr = dec2hex(r);
	var ng = dec2hex(g);
	var nb = dec2hex(b);
	nr = nr.length<2?"0"+nr:nr;
	ng = ng.length<2?"0"+ng:ng;
	nb = nb.length<2?"0"+nb:nb;
	return "#"+nr+ng+nb;
}

function background(r,g,b){
	var color = rgb(r,g,b);
	ctx.save();
	ctx.fillStyle = color;
	ctx.fillRect(0,0,WIDTH,HEIGHT);
	ctx.restore();
}

function linspace(x0,xf,N){
	var h = (xf - x0)/(N-1);
	var out = [];
	var x = x0;
	for(var i = 0;i<N;i++){
		out.push(x);
		x += h;
	}
	return out;
}

function map(x,a,b,p,q){
	return (q-p)*(x-a)/(b-a) + p;
}

function setXAxis(minValue,maxValue){
	xmin = minValue;
	xmax = maxValue;
}

function setYAxis(minValue,maxValue){
	ymin = minValue;
	ymax = maxValue;
}

var g = 10;
var dt = 0.1;

var tmpx;
var tmpy;
var m;
var v;

var slidingObject = function(f,df,x0,color){
	this.fun = f;
	this.dfun = df;
	this.px = x0;
	this.py = this.fun(x0)
	this.y0 = this.py+0.1;

	this.update = function(){
		if(this.px<xmax){
			m = this.dfun(this.px);
			v = Math.sqrt(2*g*(this.y0-this.py));
			this.nx = this.px + (v*dt)**2 / Math.sqrt(1 + m**2);
			this.ny = this.fun(this.nx);		}
	}

	this.draw = function(){
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = color;
		tmpx = map(this.px,xmin,xmax,0,WIDTH);
		tmpy = map(this.py,ymin,ymax,HEIGHT,0); 
		ctx.moveTo(tmpx,tmpy);
		tmpx = map(this.nx,xmin,xmax,0,WIDTH);
		tmpy = map(this.ny,ymin,ymax,HEIGHT,0);
		ctx.lineTo(tmpx,tmpy);
		ctx.stroke();
		ctx.restore();
		this.px = this.nx;
		this.py = this.ny;
	}
}
