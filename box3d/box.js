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

function background(c){
	push();
	fill(c);
	rect(0,0,WIDTH,HEIGHT);
	pop();
};

var eVector3D = function(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	};
	this.diff = function(v){
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
	};
	this.times = function(num){
		this.x *= num;
		this.y *= num;
		this.z *= num;	
	};
	this.dot = function(v){
		return this.x*v.x + this.y*v.y + this.z*v.z;
	};
	this.copy = function(){
		return new eVector3D(this.x,this.y,this.z);
	};
	this.norm = function(){
		return Math.sqrt(this.x*v.x + this.y*v.y + this.z*v.z);
	};
	
	this.normalize = function(){
		var d = this.norm();
		this.x /= d;
		this.y /= d;
		this.z /= d;
	};
	//rotating using the rotation matrices
	this.rotateX = function(angle){
		var x = this.x;
		var y = this.y;
		var z = this.z;
		this.x = x;
		this.y = Math.cos(angle)*y + Math.sin(angle)*z;
		this.z = -Math.sin(angle)*y + Math.cos(angle)*z;
	};

	this.rotateY = function(angle){
		var x = this.x;
		var y = this.y;
		var z = this.z;
		this.x = Math.cos(angle)*x + Math.sin(angle)*z;
		this.y = y;
		this.z = -Math.sin(angle)*x + Math.cos(angle)*z;
	};
	this.rotateZ = function(angle){
		var x = this.x;
		var y = this.y;
		var z = this.z;
		this.x = Math.cos(angle)*x + Math.sin(angle)*y;
		this.y = -Math.sin(angle)*x + Math.cos(angle)*y;
		this.z = z;
	};
	
};

var eVector2D = function(x,y){
	this.x = x;
	this.y = y;
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	this.diff = function(v){
		this.x -= v.x;
		this.y -= v.y;
	};
	this.times = function(num){
		this.x *= num;
		this.y *= num;
	};
	this.dot = function(v){
		return this.x*v.x + this.y*v.y;
	};
	this.copy = function(){
		return new eVector2D(this.x,this.y);
	};
	this.norm = function(){
		return Math.sqrt(this.x*v.x + this.y*v.y );
	};
	this.normalize = function(){
		var d = this.norm();
		this.x /= d;
		this.y /= d;
	};
	this.rotate = function(angle){
		var x = this.x;
		var y = this.y;
		this.x = x*Math.cos(angle) + y*Math.sin(angle);
		this.y = -x*Math.sin(angle) + y*Math.cos(angle);
	};
};

var eObject3D = function(){
	this.points = [];
	this.connections = {};
	this.copy = function(){
		var o = new eObject3D();
		for(var elem of this.points){
			o.addPoint(elem.copy());
		}
		o.connections = this.connections;
		return o;
	};
	this.addPoint = function(p){ 
		this.points.push(p);
	};
	this.rotateX = function(angle){
		for(var i in this.points){
			this.points[i].rotateX(angle);
		}
	};
	this.rotateY = function(angle){
		for(var i in this.points){
			this.points[i].rotateY(angle);
		}
	};
	this.rotateZ = function(angle){
		for(var i in this.points){
			this.points[i].rotateZ(angle);
		}
	};
	this.connect = function(i,j){
		if(this.connections[i] == null){
			this.connections[i] = [j];
		}
		else{
			this.connections[i].push(j);
		}
	};
	this.translate = function(p){
		if(this.points.length>0){
			p.diff(this.points[0]);
			for(var i in this.points)
				this.points[i].add(p);
		}
	};
};

var eCamera = function(){
	this.view = function(o){
		push();
		stroke(rgb(0));
		strokeWeight(4);
		fill(rgb(100));
		//We are viewing from the top so we just take the x and y components (like projecting all the points in that direction)
		for(var elem of o.points){
			//circle(elem.x,elem.y,5);
		}
		if(o.connections !=null){
			for(var i in o.points){
				if(o.connections[i] == null)
					continue;
				for(var j of o.connections[i]){
					line(o.points[i].x,o.points[i].y,o.points[j].x,o.points[j].y);
				}
			}
		}
		pop();
	};
};

camera = new eCamera();

function createLine(p1,p2){
	var obj = new eObject3D();
	obj.addPoint(p1);
	obj.addPoint(p2);

	obj.connect(0,1);

	return obj;
};

function createBlock(p,w,h,t){
	var obj = new eObject3D();
	
	obj.addPoint(new eVector3D(p.x,p.y,p.z));//0
	obj.addPoint(new eVector3D(p.x+w,p.y,p.z));//1
	obj.addPoint(new eVector3D(p.x,p.y+h,p.z));//2
	obj.addPoint(new eVector3D(p.x+w,p.y+h,p.z));//3
	obj.addPoint(new eVector3D(p.x,p.y,p.z+t));//4
	obj.addPoint(new eVector3D(p.x+w,p.y,p.z+t));//5
	obj.addPoint(new eVector3D(p.x,p.y+h,p.z+t));//6
	obj.addPoint(new eVector3D(p.x+w,p.y+h,p.z+t));//7

	obj.connect(0,1);
	obj.connect(1,3);
	obj.connect(2,3);
	obj.connect(2,0);

	obj.connect(4,5);
	obj.connect(5,7);
	obj.connect(6,7);
	obj.connect(6,4);

	obj.connect(0,4);
	obj.connect(1,5);
	obj.connect(2,6);
	obj.connect(3,7);

	return obj;
};

function createSphere(p,r,N){
	var phi = 0;
	var theta = 0;
	var dangle = PI/N;
	var tmp;
	var obj = new eObject3D();
	var count;
	obj.addPoint(new eVector3D(p.x,p.y,p.z+r));
	count = 0;
	theta = 0;
	phi += dangle;
	obj.addPoint(new eVector3D(p.x+r*Math.cos(theta)*Math.sin(phi),p.y+r*Math.sin(theta)*Math.sin(phi),p.z+r*Math.cos(phi)));
	count++;
	obj.connect(0,count);
	for(var i=1;i<N-1;i++){
		theta += 2*dangle;
		obj.addPoint(new eVector3D(p.x+r*Math.cos(theta)*Math.sin(phi),p.y+r*Math.sin(theta)*Math.sin(phi),p.z+r*Math.cos(phi)));
		count++;
		obj.connect(0,count);
		obj.connect(count-1,count);
	}
	theta += 2*dangle;
	obj.addPoint(new eVector3D(p.x+r*Math.cos(theta)*Math.sin(phi),p.y+r*Math.sin(theta)*Math.sin(phi),p.z+r*Math.cos(phi)));
	count++;
	obj.connect(0,count);
	obj.connect(count-1,count);
	obj.connect(count,1);

	for(var i = 2;i<N-1;i++){
		theta = 0;
		phi += dangle;
		obj.addPoint(new eVector3D(p.x+r*Math.cos(theta)*Math.sin(phi),p.y+r*Math.sin(theta)*Math.sin(phi),p.z+r*Math.cos(phi)));
		count++;
		obj.connect(count,count - N);		
		for(var j=1;j<N-1;j++){
			theta += 2*dangle;
			obj.addPoint(new eVector3D(p.x+r*Math.cos(theta)*Math.sin(phi),p.y+r*Math.sin(theta)*Math.sin(phi),p.z+r*Math.cos(phi)));
			count++;
			obj.connect(count,count-1);
			obj.connect(count,count-N);
		}
		theta += 2*dangle;
		obj.addPoint(new eVector3D(p.x+r*Math.cos(theta)*Math.sin(phi),p.y+r*Math.sin(theta)*Math.sin(phi),p.z+r*Math.cos(phi)));
		count++;
		obj.connect(count,count-1);
		obj.connect(count,count+1 - N);
		obj.connect(count,count -N);
	}
	phi += dangle;
	theta = 0;
	obj.addPoint(new eVector3D(p.x+r*Math.cos(theta)*Math.sin(phi),p.y+r*Math.sin(theta)*Math.sin(phi),p.z+r*Math.cos(phi)));	
	count++;
	for(var i =0;i<N;i++){
		obj.connect(count,count - N -1-i);
	}
	return obj;
};

function add3DObject(id,o){
	world[id] = o;
	ids.push(id);
};

function showObjects(){
	for(var elem of ids){
		camera.view(world[elem]);
	};
};

function rotateXAxis(angle){
	angle *= -1;
	for(var elem of ids){
		world[elem].rotateX(angle);
	};	
};

function rotateYAxis(angle){
	angle *= -1;
	for(var elem of ids){
		world[elem].rotateY(angle);
	};	
};

function rotateZAxis(angle){
	angle *= -1;
	for(var elem of ids){
		world[elem].rotateZ(angle);
	};	
};

function translateAxis(p){
	p.times(-1);
	for(var elem of ids){
		world[elem].translate(p);
	};
};

function rotateXObject(id,angle){
	world[id].rotateX(angle);
};

function rotateYObject(id,angle){
	world[id].rotateY(angle);
};

function rotateZObject(id,angle){
	world[id].rotateZ(angle);
};

function translateObject(id,p){
	world[id].translate(p);
};