var ctx;
var width;
var height;


function createCanvas(w,h){
    var canvas = document.createElement("canvas");
    canvas.id = "mycanvas";
    canvas.width = "" + w;
    canvas.height = "" + h;
    canvas.style = "border: solid 1px;";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    width = w;
    height = h;
    return canvas;
}

function drawCircle(x,y,r){
    ctx.beginPath();
    ctx.arc(x,y,r,0,2*Math.PI);
    ctx.stroke();
    ctx.closePath();
}


function drawLine(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
}

function complex(real,img){
    this.real = real;
    this.img = img;

    this.plus = function(c){
	return new complex(this.real + c.real,this.img + c.img);
    };
    this.minus = function(c){
	return new complex(this.real - c.real,this.img - c.img);
    };
    this.times = function(c){
	return new complex(this.real*c.real - this.img*c.img,this.real*c.img + this.img*c.real);
    };
    this.conj = function(){
	return new complex(this.real,-this.img);
    };
    this.norm = function(){
	return (this.real**2 + this.img**2)**0.5
    };
    this.angle = function(){
	return Math.atan2(this.img,this.real);
    };
    this.exp = function(){
	var r = Math.exp(this.real);
	return new complex(r*Math.cos(this.img),r*Math.sin(this.img));
    };
}

function generatePoints(N){
    var x,y;
    var t = 0
    var h = 2*Math.PI/(N-1);
    var arr = []
    for(var i = 0;i<N;i++){
	x = Math.cos(t)**3;
	y = Math.sin(t)**3;
	// x = (2*Math.cos(t) + 1)*Math.cos(t)
	// y = (2*Math.cos(t) + 1)*Math.sin(t)
	t += h;
	arr.push(new complex(x,y));
    }
    return arr
}

function toComplexArr(x,y){
    var n = x.length;
    var out = [];
    for(var i = 0;i<n;i++){
	out.push(new complex(x[i],y[i]));
    }
    return out;
    
}

function dft(arr){
    var n = arr.length;
    var xk = [];
    var tmp,acc;
    for(var k = 0;k<n;k++){
	acc = new complex(0,0);
	for(var i = 0;i<n;i++){
	    tmp = new complex(0,-2*Math.PI*i*k/n).exp();
	    tmp = tmp.times(arr[i]);
	    acc = acc.plus(tmp);
	}
	xk.push(acc);
    }
    return xk;
}

function getRadiusPhase(xk){
    var n = xk.length;
    var info = [];

    for(var i = 0;i<n;i++){
	info.push([xk[i].norm(),xk[i].angle()]);
    }
    return info;
}


function drawFourierCircles(info,t,x0,y0,scale){
    var n = info.length;
    var r,p;
    var x1,y1;
    var w = 2*Math.PI/n;
    for(var i = 0;i<n;i++){
	r = info[i][0]*scale;
	p = info[i][1];
	x1 = x0 + r*Math.cos(i*w*t + p);
	y1 = y0 + r*Math.sin(i*w*t + p);
	drawCircle(x0,y0,r);
	drawLine(x0,y0,x1,y1);
	x0 = x1;
	y0 = y1;
    }
    return [x1,y1];
}

function clearScreen(){
    ctx.save();
    ctx.beginPath();
    ctx.rect(0,0,width,height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawLines(arr,color){
    ctx.save();
    ctx.beginPath();
    n = arr.length;
    ctx.strokeStyle = color;
    ctx.moveTo(arr[0][0],arr[0][1]);
    for(var i = 1;i<n;i++){
	ctx.lineTo(arr[i][0],arr[i][1]);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}
