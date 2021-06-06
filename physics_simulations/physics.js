// Drawing Tools
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

function clearCanvas(){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawLine(x1,y1,x2,y2){
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

function drawCircle(xc,yc,r,color){
    ctx.save();
    ctx.beginPath();
    ctx.arc(xc,yc,r,0,2*Math.PI);
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawSpring(x1,y1,x2,y2,n){
    drawLine(x1,y1,x2,y2);
}

// Math Tools

function myvector(arr){
    this.data = arr;

    this.size = () =>{
	return this.data.length;
    };
    this.plus = (v1) => {
	let out = [];
	for(let i in this.data){
	    out.push(this.data[i] + v1.data[i]);
	}
	return new myvector(out);
    };
    this.minus = (v1) => {
	let out = [];
	for(let i in this.data){
	    out.push(this.data[i] - v1.data[i]);
	}
	return new myvector(out);
    };
    this.times = (num) => {
	let out = [];
	for(let i in this.data){
	    out.push(this.data[i] * num);
	}
	return new myvector(out);
    };

    this.dot = (v1) => {
	let s = 0;
	for(let i in this.data){
	    s += this.data[i] * v1.data[i];
	}
	return s;
    };
}

function rungeKutta(funf,x0,t0,dt){
    let k1 = funf(x0,t0);
    let k2 = funf(x0.plus(k1.times(dt/2)),t0 + dt/2);
    let k3 = funf(x0.plus(k2.times(dt/2)),t0 + dt/2);
    let k4 = funf(x0.plus(k3.times(dt)),t0 + dt);

    k1 = k1.times(dt/6);
    k2 = k2.times(dt/3);
    k3 = k3.times(dt/3);
    k4 = k4.times(dt/6);
    return x0.plus(k1).plus(k2).plus(k3).plus(k4);
}


let default_double_pendulum_dict = {
    "l1" : 5,
    "l2" : 5,
    "m1" : 1,
    "m2" : 1,
    "r1" : 1,
    "r2" : 1,
    "g"  : 1,
    "scale" : 20
};

let default_parabollic_motion_dict = {
    "g" : 40,
    "r" : 1,
    "scale" : 20
};

let default_spring_motion_dict = {
    "mass" : 1,
    "r" : 20,
    
    "springs":{
	"1":{
	    "k" : 1,
	    "l" : 100,
	    "x" : 250,
	    "y" : 10
	},
	"2":{
	    "k" : 1,
	    "l" : 100,
	    "x" : 10,
	    "y" : 250
	},
	"3":{
	    "k" : 1,
	    "l" : 100,
	    "x" : 250,
	    "y" : 490
	},
	"4":{
	    "k" : 1,
	    "l" : 100,
	    "x" : 490,
	    "y" : 250
	}
    }
}

function doublePendulum(info,angle0,t0){
    let out = [];
    let a = angle0.data[0]; // theta
    let b = angle0.data[1]; // phi
    let a1 = angle0.data[2];// theta dot 
    let b1 = angle0.data[3];// phi dot
    let l1 = info["l1"];
    let l2 = info["l2"];
    let m1 = info["m1"];
    let m2 = info["m2"];
    let g = info["g"];

    // Motion Equation got from Euler-Lagrange Equation
    out.push(a1);
    out.push(b1);
    out.push((-2*m2*Math.sin(a - b)*(l2*b1*b1 + l1*Math.cos(a - b)*a1*a1) - (2*m1 + m2)*g*Math.sin(a) + m2*g*Math.sin(2*b - a))/(l1*(2*m1 + m2) - m2*l1*Math.cos(2*a - 2*b)));
    out.push((2*Math.sin(a-b)*((m1 + m2)*l1*a1*a1 + l2*m2*Math.cos(a - b)*b1*b1 + (m1+m2)*g*Math.cos(a)))/(l2*(2*m1 + m2) - m2*l2*Math.cos(2*a - 2*b)));

    return new myvector(out);
}

function parabollicMotion(info,u0,t0){
    let out = [];
    let x = u0.data[0];
    let y = u0.data[1];
    let x1 = u0.data[2];
    let y1 = u0.data[3];
    let g = info["g"];
    
    out.push(x1);
    out.push(y1);
    out.push(0);
    out.push(g);

    return new myvector(out);
}

function springMotion(info,u0,t0){
    let out = [];
    let x = u0.data[0];
    let y = u0.data[1];
    let x1 = u0.data[2];
    let y1 = u0.data[3];
    let tmpx;
    let tmpy;
    let tmpk;
    let l;
    let d;
    
    let fx = 0;
    let fy = 0;

    let mass = info["mass"];
    let springs = info["springs"];
    
    for(let s in springs){
	tmpk = springs[s]["k"];
	tmpx = x - springs[s]["x"];
	tmpy = y - springs[s]["y"];
	l = springs[s]["l"];
	d = Math.sqrt(tmpx*tmpx + tmpy*tmpy);
	fx += tmpk * tmpx * (l - d)/d;
	fy += tmpk * tmpy * (l - d)/d;
    }

    out.push(x1);
    out.push(y1);
    out.push(fx/mass);
    out.push(fy/mass);

    return new myvector(out);
}

function drawDoublePendulum(info,angle0,pos0){
    let x0 = pos0.data[0];
    let y0 = pos0.data[1];
    let a = angle0.data[0]; // theta
    let b = angle0.data[1]; // phi
    let scale = info["scale"];
    let l1 = info["l1"];
    let l2 = info["l2"];
    let m1 = info["m1"];
    let m2 = info["m2"];
    let r1 = info["r1"];
    let r2 = info["r2"];
    let x1 = x0 + l1*Math.sin(a)*scale;
    let y1 = y0 + l1*Math.cos(a)*scale;
    let x2 = x1 + l2*Math.sin(b)*scale;
    let y2 = y1 + l2*Math.cos(b)*scale;

    drawLine(x0,y0,x1,y1);
    drawCircle(x1,y1,scale*r1,"rgb(255,0,200)");
    drawLine(x1,y1,x2,y2);
    drawCircle(x2,y2,scale*r2,"rgb(0,255,100)");
}

function drawParabollicMotion(info,u0){
    let r = info["r"];
    let scale = info["scale"];
    let x = u0.data[0];
    let y = u0.data[1];

    drawCircle(x,y,scale*r,"rgb(255,0,100)");
}

function drawSpringMotion(info,u0){
    let x = u0.data[0];
    let y = u0.data[1];
    let r = info["r"];
    let tmpx;
    let tmpy;
    
    drawCircle(x,y,r,"rgb(100,100,200)");

    let springs = info["springs"];
    for(let s in springs){
	tmpx = springs[s]["x"];
	tmpy = springs[s]["y"];
	drawSpring(tmpx,tmpy,x,y,10);
    }
}

function startDoublePendulumAnimation(info,x0,dt,pos0){
    let funf = (x,t) => {
	return doublePendulum(info,x,t);
    };

    let curr_angle = x0;
    let curr_t = 0;

    let counter = 0;
    let pendulum_update = ()=>{
	//if(counter%5 == 0)
	    clearCanvas();
	//counter = (counter + 1)%100;
	drawDoublePendulum(info,curr_angle,pos0);
	curr_angle = rungeKutta(funf,curr_angle,curr_t,dt);
	curr_t += dt;
    };

    setInterval(pendulum_update,20);    
}

function startParabollicMotion(info,x0,dt){
    let funf = (x,t) => {
	return parabollicMotion(info,x,t);
    };

    let curr_u = x0;
    let curr_t = 0;

    let level = x0.data[1];

    let counter = 0;
    let parabollic_update = () => {
	if(curr_u.data[1] <= level){
	    //clearCanvas();
	    drawParabollicMotion(info,curr_u);
	    curr_u = rungeKutta(funf,curr_u,curr_t,dt);
	    curr_t += dt;
	}
    };

    setInterval(parabollic_update,20);
}

function startSpringMotion(info,x0,dt){
    let funf = (x,t) => {
	return springMotion(info,x,t);
    };

    let curr_u = x0;
    let curr_t = 0;

    let counter = 0;
    let spring_update = () => {
	if(counter < 1000){
	    clearCanvas();
	    drawSpringMotion(info,curr_u);
	    curr_u = rungeKutta(funf,curr_u,curr_t,dt);
	    curr_t += dt;
	    counter += 1;
	}
    };

    setInterval(spring_update,20);
}

//startDoublePendulumAnimation(default_double_pendulum_dict,new myvector([1,0.5,0,0]),0.1,new myvector([250,200]));
//startParabollicMotion(default_parabollic_motion_dict,new myvector([50,400,60,-150]),0.1);
startSpringMotion(default_spring_motion_dict,new myvector([150,10,0,0]),0.1)
