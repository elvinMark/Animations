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
    "l2" : 6,
    "m1" : 1,
    "m2" : 1,
    "r1" : 1,
    "r2" : 1,
    "g"  : 1,
    "scale" : 20
};

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
    
    out.push(a1);
    out.push(b1);
    out.push((-2*m2*Math.sin(a - b)*(l2*b1*b1 + l1*Math.cos(a - b)*a1*a1) - (2*m1 + m2)*g*Math.sin(a) + m2*g*Math.sin(2*b - a))/(l1*(2*m1 + m2) - m2*l1*Math.cos(2*a - 2*b)));
    out.push((2*Math.sin(a-b)*((m1 + m2)*l1*a1*a1 + l2*m2*Math.cos(a - b)*b1*b1 + (m1+m2)*g*Math.cos(a)))/(l2*(2*m1 + m2) - m2*l2*Math.cos(2*a - 2*b)));

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

startDoublePendulumAnimation(default_double_pendulum_dict,new myvector([2,3,0,0]),0.1,new myvector([250,200]));
