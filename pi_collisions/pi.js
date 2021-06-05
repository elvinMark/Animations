var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

function clearCanvas(){
    ctx.save();
    ctx.beginPath()
    ctx.fillStyle = "rgb(255,255,255)";
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

function drawRect(x1,y1,w,h,color){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x1,y1,w,h);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

function drawText(x,y,str){
    ctx.save();
    ctx.font = "20px serif";
    ctx.fillText(str,x,y);
    ctx.restore();
}

function myblock(x,y,vx,vy,m,dim,color){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.mass = m;
    this.dim = dim;
    this.color = color;
    
    this.draw = ()=>{
	drawRect(this.x,this.y,this.dim,this.dim,this.color);
    };

    this.update = ()=>{
	this.x += this.vx;
	this.y += this.vy;
    };
}

let num_collisions = 0;

function checkWall(b){
    // if(b.x + b.dim > canvas.width){
    // 	b.x = canvas.width - b.dim;
    // 	b.vx *= -1;
    // }
    if(b.x < 0){
	b.x = 0
	b.vx *= -1;
	num_collisions += 1;
    }
}


function collide(b1,b2){
    let d = b1.x - b2.x;
    if(b1.x < b2.x && -d < b1.dim || b1.x > b2.x && d < b2.dim){
	let a = Math.sqrt(b2.mass) / Math.sqrt(b1.mass);
	let p1 = Math.sqrt(b1.mass) * b1.vx;
	let p2 = Math.sqrt(b2.mass) * b2.vx;
	let q1 = (2*a*p2 + p1*(1 - a*a))/(1 + a*a);
	let q2 = (2*a*p1 - p2*(1 - a*a))/(1 + a*a);
	b1.vx = q1 / Math.sqrt(b1.mass);
	b2.vx = q2 / Math.sqrt(b2.mass);
	num_collisions += 1;
    }
}

let block1 = new myblock(100,200,0,0,1,40,"rgb(255,0,0)");
let block2 = new myblock(300,100,-3,0,1000,140,"rgb(0,255,0)");

function updateFrame(){
    clearCanvas();
    block1.update();
    block2.update();
    
    checkWall(block1);
    checkWall(block2);

    collide(block1,block2);
    
    block1.draw();
    block2.draw();
    drawText(20,20,"" + num_collisions);
};

setInterval(updateFrame,20);

