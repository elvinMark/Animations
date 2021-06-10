var ctx;
var HEIGHT;
var WIDTH;

var QUARTER_PI = Math.PI/4;
var HALF_PI = Math.PI/2;
var PI = Math.PI;
var TWO_PI = 2*Math.PI;

var stroking = true;
var filling = false;

var HEX = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];

var world = {};
var ids = [];
var camera;

function dec2hex(num){
	if(num/15<=1){
		return HEX[num];
	}
	else{
		return dec2hex(Math.floor(num/16))+HEX[num%16];
	}
};

function print(s){
	console.log(s);
};

function createCanvas(w,h){
	document.body.innerHTML += "<canvas id='mycanvas' width='"+w+"'"+" height='"+h+"' "+"style='border:solid 1px;'></canvas>";
	ctx = document.getElementById("mycanvas").getContext("2d");
	WIDTH = w;
	HEIGHT = h;
};

function push(){
	ctx.save();
};

function pop(){
	ctx.restore();
};

function rgb(r,g,b){
	var r1;
	var g1;
	var b1;
	if(g==null || b==null){
		r1 = dec2hex(r);
		g1 = dec2hex(r);
		b1 = dec2hex(r);			
	}
	else{
		r1 = dec2hex(r);
		g1 = dec2hex(g);
		b1 = dec2hex(b);
	}
	r1 = r1.length<2?"0"+r1:r1;
	g1 = g1.length<2?"0"+g1:g1;
	b1 = b1.length<2?"0"+b1:b1;
	return "#"+r1+g1+b1;
};

function stroke(c){
	stroking = true;
	ctx.lineStyle = c;
};

function strokeWeight(w){
	ctx.lineWidth = w;
};

function noStroke(){
	stroking = false;
};

function fill(c){
	filling = true;
	ctx.fillStyle = c;
};

function noFill(){
	filling = false;
};

function rotate(angle){
	ctx.rotate(angle);
};

function translate(x,y){
	ctx.translate(x,y);
};

function line(x1,y1,x2,y2){
	push();
	ctx.beginPath();
	ctx.moveTo(x1,y1);
	ctx.lineTo(x2,y2);
	if(stroking)
		ctx.stroke();
	if(filling)
		ctx.fill();
	pop();
};

function ellipse(x,y,w,h){
	push();
	ctx.beginPath();
	ctx.ellipse(x,y,w,h,0,0,2*Math.PI);
	if(stroking)
		ctx.stroke();
	if(filling)
		ctx.fill();
	pop();
};

function circle(x,y,r){
	push();
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI);
	if(stroking)
		ctx.stroke();
	if(filling)
		ctx.fill();
	pop();	
};

function rect(x1,y1,w,h){
	push();
	ctx.beginPath();
	ctx.rect(x1,y1,w,h);
	if(stroking)
		ctx.stroke();
	if(filling)
		ctx.fill();
	pop();
};

function square(x,y,d){
	rect(x,y,d,d);
};

function background(c){
	push();
	fill(c);
	rect(0,0,WIDTH,HEIGHT);
	pop();
};

var data;
var N;
var t = 10;

function isOrdered(){
	for(var i = 1;i<N;i++){
		if(data[i]<data[i-1])
			return false;
	}
	return true;
}
function map(x,a,b,p,q){
	return p + (x-a)*(q-p)/(b-a);
}

function createList(length){
	data = [];
	N = length;
	for(var i = 0;i<N;i++)
		data.push(i+1);
}

function shuffle(){
	var tmp;
	var idx;
	for(var i = 0;i<N;i++){
		idx = Math.floor(N*Math.random());
		tmp = data[i];
		data[i] = data[idx];
		data[idx] = tmp;
	}
}

function printList(){
	console.log(data.toString());
}

function graphData(){
	var x = 50;
	var y = 400;
	fill(rgb(0,0,0));
	for(var i = 0;i<N;i++){
		rect(x,y,t,-map(data[i],1,N,10,300));
		x += t+5;
	}
}

var bubble;
function bubble_sort(){
	var tmp;
	if(data[bubble]>data[bubble+1]){
		tmp = data[bubble];
		data[bubble] = data[bubble+1];
		data[bubble+1] = tmp;
	}
	bubble=(bubble+1)%(N-1);
}

function insertion_method(){
	
}

var sort_method;

function setMethod(method){
	sort_method = method;
	switch(sort_method){
		case "bubble":
			bubble=0;
			break;
		default:
			break;
	}
}
function sort(step){
	switch(sort_method){
		case "bubble":
			bubble_sort();
			break;
		default:
		break;
	}
}